let categoryId;

const loadButtons = () => {

    fetch("https://openapi.programming-hero.com/api/videos/categories")
        .then((res) => res.json())
        .then((data) => displayButtons(data.data));
};

const displayButtons = (categories) => {
    const buttonsContainer = document.getElementById("buttons-container");
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.innerText = category.category;
        button.classList.add("category-button", "m-2");

        if (category.category_id === "1000") {
            button.classList.add("clicked");
            categoryId = category.category_id;
        }

        button.addEventListener("click", function () {
            document.querySelectorAll(".category-button").forEach((btn) => {
                btn.classList.remove("clicked");
            });

            button.classList.add("clicked");

            loadAllData(category.category_id);
            categoryId = category.category_id;
        });

        buttonsContainer.appendChild(button);
    });
};

loadButtons();

const loadAllData = (id) => {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
        .then((res) => res.json())
        .then((data) => displayData(data.data));
};

const displayData = (news) => {
    const newsContainer = document.getElementById("data-container");
    newsContainer.innerHTML = "";

    if (news.length === 0) {
        const noDataDiv = document.createElement("div");
        noDataDiv.innerHTML = `
      <div class="col text-center noDivBorder">
        <img class="noDivImg" src="./Icon.png" class="card-img-top" style="width:100px; height:100px" alt="No Data">
        <h3>Oops!! Sorry, There is no content here</h3>
      </div>`;
        newsContainer.appendChild(noDataDiv);
    } else {
        news.forEach((newss) => {
            const newsDiv = document.createElement("div");
            newsDiv.classList.add("col-sm-3");
            newsDiv.innerHTML = `
            <div class="card" style= "margin-bottom: 15px; ">
            <div class="position-relative">
                <img src="${newss.thumbnail}" class="card-img-top"style="height:200px">
                <div style="background-color: rgb(90, 90, 90); margin: 15px; padding: 4px;border-radius: 12px;" class="position-absolute bottom-0 end-0 text-white">
                    ${formatPostedDate(newss?.others?.posted_date)}
                </div>
            </div>
            <div class="card-body card-text">
              <div class="d-flex justify-content-start gap-2">
                <img src="${newss?.authors[0]?.profile_picture
                 }" style="width: 30px; height: 30px;" class="rounded-circle">
                <div>
                  <h5 class="card-title">${newss.title}</h5>
                  <div style="color:#5D5D5D;" class="d-flex justify-content-start align-content-center gap-3">
                    <p>${newss?.authors[0]?.profile_name}</p>
                    ${newss?.authors[0]?.verified
                     ? '<p><i class="fa-solid fa-circle-check"></i></p>'
                     : ""
                 }
                  </div>
                  <p style="color:#5D5D5D;" class="card-text">${newss?.others?.views
                 } views</p>
                </div>
              </div>
            </div>
          </div>
        `;
            newsContainer.appendChild(newsDiv);
        });
    }
};

function convertSecondsToHoursMinutes(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
}

function formatPostedDate(seconds) {
    const { hours, minutes } = convertSecondsToHoursMinutes(seconds);
    if (hours > 0) {
        return `${hours}hrs ${minutes}min ago`;
    } else {
        return "";
    }
}

function sortByViews() {
    console.log(categoryId);
    fetch(
        `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
    )
        .then((res) => res.json())
        .then((data) => {
            const sortedNews = data.data.sort((a, b) => {
                const viewsA = parseViews(a.others.views);
                const viewsB = parseViews(b.others.views);
                return viewsB - viewsA;
            });

            displayData(sortedNews);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function parseViews(views) {
    const numericViews = parseFloat(views.replace("K", "e3").replace("M", "e6"));
    return isNaN(numericViews) ? 0 : numericViews;
}

loadAllData("1000");
