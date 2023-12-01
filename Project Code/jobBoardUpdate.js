

const sortDateAsc = document.querySelector("#sortByDateAsc")
const sortDateDesc = document.querySelector("#sortByDateDesc")

sortDateAsc.addEventListener('click', (e) => {
    console.log("Sorting Ascending");
    updateAndSort('asc');
});

sortDateDesc.addEventListener('click', (e) => {
    console.log("Sorting Descending");
    updateAndSort('desc');
});

console.log("jobUtils.js loaded");
function parseDate(dateString) {
    var parts = dateString.split(/[-T:Z.]/);
    var dateObject = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]));
    var formattedDate = (dateObject.getMonth() + 1).toString().padStart(2, '0') +
                        '/' +
                        dateObject.getDate().toString().padStart(2, '0') +
                        '/' +
                        dateObject.getFullYear();
                        
    return formattedDate;
}

function sortByDate(order) {
    jobs.sort(function (a, b) {
        var dateA = new Date(a.date_posted);
        var dateB = new Date(b.date_posted);
        
        return order === 'asc' ? dateA - dateB : dateB - dateA;
        
    });
}

function renderJobCards() {
    var jobCardsContainer = document.querySelector('.job-cards-container');
    jobCardsContainer.innerHTML = '';

    jobs.forEach(function(job) {
        var card = document.createElement('div');
        card.className = 'card';
        card.style = 'width: 30rem;';

        var formattedDate = parseDate(job.date_posted);
        console.log("Poop")
        

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${job.role}</h5>
                <p class="card-text">Company: ${job.company}</p>
                <p class="card-text">Location: ${job.location}</p>
                <p class="card-text">Date Posted: ${formattedDate}</p>
                <a href="${job.application_link}" class="btn btn-primary">Apply</a>
            </div>
        `;

        jobCardsContainer.appendChild(card);
    });
}