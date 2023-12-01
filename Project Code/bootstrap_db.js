const fs = require('fs');
const path = require('path');
const marked = require('marked');
const request = require('request');
const pgp = require('pg-promise')();

// Connect to database stuff
const dbConfig = {
    host: 'db',
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
};

const db = pgp(dbConfig);

// Test the connection
db.connect().then(obj => {
    console.log("Connected to the database");
    obj.done(); // success, release the connection;
}).catch(error => {
    console.log("Error connecting to the database");
    console.log(error);
});

const urlRegex = /<a href="(https:\/\/[^"]+?)(?:\?.+?)?"/;

data = [];

var previous_company = ""; // The provided table uses `↳` to idicate that the company is the same as the previous row


function formatDateForPostgres(dateString) {
  const currentYear = new Date().getFullYear();
  let parts = dateString.split(' ');

  // If there is only one part, assume it's the year
  if (parts.length === 1) {
    dateString = `Jan 01 ${parts[0]}`;
  } else if (parts.length === 2) {
    // If there are two parts and the second part is a 4-digit year, prepend a default day (01)
    if (parts[1].length === 4) {
      dateString = `Jan ${parts[0]} ${parts[1]}`;
    } else {
      // If there are two parts and the second part is not a 4-digit year, assume the first is the month and the second is the day
      // and append the current year.
      dateString = `${parts[0]} ${parts[1]} ${currentYear}`;
    }
  }

  // Parse the date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new RangeError('Invalid time value');
  }

  // Format the date in the 'YYYY-MM-DD' format expected by Postgres
  const formattedDate = date.toISOString().split('T')[0];

  return formattedDate;
}

function parse_and_insert(link_to_md, is_internship = false) {
    // Read the markdown content from a URL
request(link_to_md, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Fetched the markdown content from the URL");
        const tokens = marked.lexer(body);
        const tableToken = tokens.find(token => token.type === 'table');

        firstRowCompany = tableToken.rows[0][0].tokens[0].tokens[0].text;
        firstRowRole = tableToken.rows[0][1].tokens[0].text;
        firstRowLocation = tableToken.rows[0][2].tokens[0].text;
        firstRowLink = tableToken.rows[0][3].tokens[0].raw;
        link_matches = firstRowLink.match(urlRegex);
        if (link_matches) {
            firstRowLink = link_matches[1];
        }
        firstRowDate = tableToken.rows[0][4].tokens[0].text;


        // Loop through the rows of the table
        for (let i = 1; i < tableToken.rows.length ; i++) {
            company = "";
            try {
            company = tableToken.rows[i][0].tokens[0].tokens[0].text;
            } catch (error) {
                company = tableToken.rows[i][0].tokens[0].text;
            }
            if (company == "↳") {
                company = previous_company;
            }
            role = tableToken.rows[i][1].tokens[0].text;
            location = tableToken.rows[i][2].tokens[0].text;
            link = tableToken.rows[i][3].tokens[0].raw;
            link_matches = link.match(urlRegex);
            if (link_matches) {
                link = link_matches[1];
            }
            date = tableToken.rows[i][4].tokens[0].text;
            date = formatDateForPostgres(date);

            if (link === "🔒") {
                continue;
            }

            requires_us_citizenship = false;

            if (role.includes("🇺🇸")) {
                requires_us_citizenship = true;
                role = role.replace("🇺🇸", "");
            }

            offers_sponsorship = true;

            if (role.includes("🛂")) {
                offers_sponsorship = false;
                role = role.replace("🛂", "");
            }

            company = company.trim();
            role = role.trim();
            location = location.trim();
            link = link.trim();
            date = date.trim();

            previous_company = company;

            // Insert the row into the data array as a dictionary
            data.push({
                "company": company,
                "role": role,
                "requires_us_citizenship": requires_us_citizenship,
                "offers_sponsorship": offers_sponsorship,
                "date_posted": date,
                "location": location,
                "application_link": link,
                "internship": is_internship
            });
        }
        // Insert the data into the database table `jobs`

        const cs = new pgp.helpers.ColumnSet(
            ['company', 'role', 'requires_us_citizenship', 'offers_sponsorship', 
                'date_posted', 'location', 'application_link', 'internship'], {table: 'jobs'});
        // Add ignoreDuplicates: true to ignore duplicate rows
        const query = pgp.helpers.insert(data, cs) + " ON CONFLICT (application_link) DO NOTHING";

        db.none(query)
            .then(() => {
                console.log("Successfully inserted the data into the database");
            }
            )
            .catch(error => {
                console.log("Error inserting the data into the database");
                console.log(error);
            }
            );


    } else {
        console.log("Error fetching the markdown content from the URL");
    }
});
}

const summer_internships_link = "https://raw.githubusercontent.com/SimplifyJobs/Summer2024-Internships/a97f420aebc92c82342cc42daa73fe94c7362ccc/README.md";
const new_grad_link = "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/README.md"

parse_and_insert(summer_internships_link, is_internship=true)
parse_and_insert(new_grad_link, is_internship=false)
