
const DOMStrings = {
    jobsContainer: document.querySelector('.joblist'),
    filtersHeader: document.querySelector('.search'),
    filtersContainer: document.querySelector('.search__content'),
    clearFiltersBtn: document.querySelector('.search__clear')
}

let filterTags = [];         // Store all the tags clicked by the user

// Retrieve the data from JSON file
const getAllJobs = async () => {
    const data = await fetch('./data.json')
    const jsonData = await data.json();
    return jsonData;
}

// Render the job on the DOM
const renderJob = job => {
    const markup = 
    `
        <li class="job ${job.new && job.featured ? 'active' : ''}">
            <img src=${job.logo} alt="" class="job__img">
            <div class="job__info">
                <div class="job__status">
                    <span class="job__company">
                        ${job.company}
                    </span>
                    ${job.new ? '<span class="new">New!</span>' : ''}
                    ${job.featured ? '<span class="featured">Featured</span>' : ''}
                </div>
                
                <div class="job__role">${job.position}</div>
                <ul class="job__details">
                    <li class="job__details--item">${job.postedAt}</li>
                    <li class="job__details--item">${job.contract}</li>
                    <li class="job__details--item">${job.location}</li>
                </ul>
            </div>

            <div class="job__tags">
                ${renderTags(job)}
            </div>
        </li>
    `;
    DOMStrings.jobsContainer.insertAdjacentHTML('beforeend', markup);
}

// Loop over all the jobs and pass each job to render function
async function createJobs(data) {
    const allJobs = await data;
    allJobs.forEach(job => {
        renderJob(job);
    });
}

// Render the tags of the job
const renderTags = job => {
    let tags = parseTags(job);
    let markup = '';

    tags.forEach(tag => {
        markup += `<span class="job__tags--item">${tag}</span>`;
    })

    return markup;
}

// Parse the tags for each job
const parseTags = job => {
    let jobTags;
    if("languages" in job && "tools" in job) {
        jobTags = [...job.languages, ...job.tools, job.role, job.level]
    } else if("languages" in job) {
        jobTags = [...job.languages, job.role, job.level];
    } else if("tools" in job) {
        jobTags = [...job.tools, job.role, job.level];
    }

    return jobTags;
}

// Add tags to array
const addToFilterTags = event => {
    if(event.target.matches('.job__tags--item')) {
        const jobTag = event.target.textContent;
        if(!filterTags.includes(jobTag)) filterTags.push(jobTag);
        renderFilterTag();
        filterJobList();
        toggleFilterVisibility();
        addToStorage();
    }
}

// Render the tags in the filter container
const renderFilterTag = () => {
    DOMStrings.filtersContainer.innerHTML = '';
    filterTags.forEach(tag => {
        const markup = 
        `
            <div class="search__item">
                <div class="search__item--category">${tag}</div>
                <div class="search__item--delete"><i class="fas fa-times"></i></div>
            </div>
        `;
        DOMStrings.filtersContainer.insertAdjacentHTML('beforeend', markup);
    });
}

// Delete the tag from the filter container and update the tags, jobs
const removeFilterTag = event => {
    if(event.target.matches('.search__item--delete, .search__item--delete *')) {
        const jobTag = event.target.parentElement.firstElementChild.textContent;
        const jobTagIndex = filterTags.findIndex(cur => cur === jobTag);
        filterTags.splice(jobTagIndex, 1);
        renderFilterTag();
        filterJobList();
        addToStorage();
    }
}

// Update the jobs based on filters
const filterJobList = async () => {
    const allJobs = await getAllJobs();
    const filteredJobs = [];

    allJobs.forEach(job => {
        let jobTags = parseTags(job);
        const checkTagPresent = filterTags.every(tag => jobTags.includes(tag));
        if(checkTagPresent) filteredJobs.push(job);
    })
    clearJobs();
    createJobs(filteredJobs);
}

// Clear all the jobs
const clearJobs = () => {
    DOMStrings.jobsContainer.innerHTML = '';
}

// Clear the filters and render all the jobs
const clearAll = () => {
    filterTags.length = 0;
    clearJobs();
    createJobs(getAllJobs());
    renderFilterTag();
    toggleFilterVisibility();
    addToStorage();
}

// Show/Hide the filter header 
const toggleFilterVisibility = () => {
    DOMStrings.filtersHeader.style.visibility = filterTags.length > 0 ? 'visible' : 'hidden';
}

// Add/Update the local storage
const addToStorage = () => {
    localStorage.setItem('jobsData', JSON.stringify(filterTags));
}

// Initial Calls

// Check if local storage has data stored
const checkLocalStorage = () => {
    if(localStorage.getItem("jobsData")) {
        filterTags = JSON.parse(localStorage.getItem("jobsData"));
        console.log(Array.from(filterTags));
        renderFilterTag();
        filterJobList();
    }
    else {
        alert('Empty Storage!');
    }
}

// Call the function to create and render the jobs on the DOM
createJobs(getAllJobs());

// If local storage has data, load it
checkLocalStorage();

// Show/Hide the job filter header
toggleFilterVisibility();


// Event Handlers setup
DOMStrings.jobsContainer.addEventListener('click', addToFilterTags);
DOMStrings.filtersContainer.addEventListener('click', removeFilterTag);
DOMStrings.clearFiltersBtn.addEventListener('click', clearAll);