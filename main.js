
const DOMStrings = {
    jobsContainer: document.querySelector('.joblist'),
    filtersContainer: document.querySelector('.search__content'),
    clearFiltersBtn: document.querySelector('.search__clear')
}

const getAllJobs = async () => {
    const data = await fetch('./data.json')
    const jsonData = await data.json();
    return jsonData;
}

const renderJob = job => {
    console.log(job);
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

async function createJobs(data) {
    const allJobs = await data;
    allJobs.forEach(job => {
        renderJob(job);
    });
}

createJobs(getAllJobs());

const renderTags = job => {
    let tags = Array.from(parseTags(job));
    console.log(tags);
    let markup = '';

    tags.forEach(tag => {
        markup += `<span class="job__tags--item">${tag}</span>`;
    })

    return markup;
}

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