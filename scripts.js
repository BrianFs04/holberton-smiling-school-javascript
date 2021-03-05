// Improves autocomplete
/// <reference types="jquery" />

$(function () {
    /** Append carousel to the DOM
     * @data {array} Data list to be displayed
     * @return {undefined} No return
     */
    displayQuotesCarousel = (data) => {
        for (let i in data) {
            const { pic_url, name, title, text } = data[i];
            $("#carouselOfQuotes").append(
                $("<div>")
                    .addClass("carousel-item")
                    .append(
                        $("<div>")
                            .addClass(
                                "d-flex flex-column flex-sm-row justify-content-center align-items-center"
                            )
                            .append(
                                $("<div>")
                                    .addClass("col-md-2 my-3 my-sm-0")
                                    .append(
                                        $("<img>")
                                            .attr({
                                                src: `${pic_url}`,
                                                alt: `${name}`,
                                            })
                                            .addClass(
                                                "d-block rounded-circle profile-5 mx-auto mx-0"
                                            )
                                    ),
                                $("<div>")
                                    .addClass(
                                        "col-sm-6 offset-sm-2 col-md-6 offset-md-1 col-xl-7 offset-xl-0 text-white"
                                    )
                                    .append(
                                        $("<p>")
                                            .addClass("quote")
                                            .text(`${text}`),
                                        $("<h5>")
                                            .addClass("font-weight-bold")
                                            .text(`${name}`),
                                        $("<span>")
                                            .addClass("font-italic")
                                            .text(`${title}`)
                                    )
                            )
                    )
            );
            $("#carouselOfQuotes div:nth-child(2)").addClass("active");
        }
    };

    /** Slides a card one by one
     *  @id {string} id of the carousel
     *  @return {undefined} No return
     */
    slider = (id) => {
        $(`#${id} .carousel-item`).each(function () {
            var minPerSlide = 4;
            var next = $(this).next();
            if (!next.length) {
                next = $(this).siblings(":first");
            }
            next.children(":first-child").clone().appendTo($(this));

            for (var i = 1; i <= minPerSlide; i++) {
                next = next.next();
                if (!next.length) {
                    next = $(this).siblings(":first");
                }

                next.children(":first-child").clone().appendTo($(this));
            }
        });
    };

    /** Appends cards to the carousel of vids
     * @data {object} Data obtained from the API
     * @return {object} card DOM
     */
    addCards = (data) => {
        const {
            id,
            title,
            thumb_url,
            author,
            author_pic_url,
            star,
            duration,
        } = data;
        let starImg = "";
        let starSrc = "";
        let starState = "";

        for (let i = 1; i <= 5; i++) {
            if (i <= star) {
                starSrc = "./images/star_on.png";
                starState = "on";
            } else {
                starSrc = "./images/star_off.png";
                starState = "off";
            }

            starImg += `<img src="${starSrc}" alt="star ${starState}" width="15px" class="offset-1"/>`;
        }
        const card = $("<div>").append(
            $("<div>")
                .addClass("img-tutorial")
                .append(
                    $("<img>")
                        .attr({
                            src: `${thumb_url}`,
                            alt: `tutorial ${id}`,
                        })
                        .addClass("card-img-top"),
                    $("<img>")
                        .attr({
                            src: `./images/play.png`,
                            alt: `play ${id}`,
                        })
                        .addClass("play")
                ),
            $("<div>")
                .addClass("card-body")
                .append(
                    $("<h5>")
                        .addClass("card-title font-weight-bold tuto-title")
                        .text(`${title}`),
                    $("<span>")
                        .addClass("card-text tuto-text")
                        .text(`${data["sub-title"]}`),
                    $("<div>")
                        .addClass("mt-3 d-flex flex-row align-items-center")
                        .append(
                            $("<img>")
                                .attr({
                                    src: `${author_pic_url}`,
                                    alt: `${author}`,
                                    width: "30px",
                                })
                                .addClass("rounded-circle"),
                            $("<span>")
                                .addClass("reviewer pl-3")
                                .text(`${author}`)
                        ),
                    $("<div>")
                        .addClass("mt-3 d-flex flex-row align-items-center")
                        .append(
                            $("<div>")
                                .addClass("d-flex")
                                .attr({
                                    id: "stars",
                                })
                                .append(starImg),
                            $("<span>")
                                .addClass("reviewer ml-auto")
                                .text(`${duration}`)
                        )
                )
        );

        return card;
    };

    /** Displays carousel of popular and latest vids
     * @data {array} Data list to be displayed
     * @return {undefined} No return
     */
    displayCarousel = (data, id) => {
        for (let i in data) {
            const card = $("<div>")
                .addClass("carousel-item")
                .append(
                    $("<div>")
                        .addClass(
                            "col-12 col-sm-6 col-lg-4 col-xl-3 d-flex justify-content-center"
                        )
                        .attr({ id: "cards" })
                        .append(
                            $("<div>")
                                .addClass("card mx-1 border-0")
                                .append(addCards(data[i]))
                        )
                );
            $(`#${id}`).append(card);
        }
        $(`#${id} div:nth-child(2)`).addClass("active");
        $("#stars img:nth-child(1)").removeClass("offset-1");

        slider(id);
    };

    /** Hides the loader when the API request is done
     * @id {string} DOM id to hide the correct loader
     * @return {} Helper function
     */
    hideLoader = (id) => $(`#${id} div.loader`).hide();

    /** Does the API GET request
     * @url {string} URL
     * @callback {} function to display correctly to the DOM
     * @id {string} id to call the hideLoader func
     */
    apiHomepageRequests = (url, callback, id) => {
        $.get(url)
            .done((response) => {
                callback(response, id);
                hideLoader(id);
            })
            .fail((error) => {
                console.error(error);
            });
    };

    const requests = [
        {
            url: "https://smileschool-api.hbtn.info/quotes",
            callback: displayQuotesCarousel,
            id: "carouselOfQuotes",
        },
        {
            url: "https://smileschool-api.hbtn.info/popular-tutorials",
            callback: displayCarousel,
            id: "mostPopularVids",
        },
        {
            url: "https://smileschool-api.hbtn.info/latest-videos",
            callback: displayCarousel,
            id: "latestVids",
        },
    ];

    for (let request of requests) {
        apiHomepageRequests(request.url, request.callback, request.id);
    }

    /* Courses page */

    const searchData = {
        keyword: "",
        topic: "",
        sort: "",
    };

    /** Clears the DOM
     * @id {string} Parent attr to be cleared
     * @return {} Helper func
     */
    cleanHTML = (id) => $(`#${id}`).empty();

    /** Adds and shows the loader
     * @id {string} Where is gonna be appended
     * @return {undefined} No return
     */
    showSpinner = (id) => {
        cleanHTML(id);
        $(`#${id}`).append($("<div>").addClass("loader"));
    };

    /** Courses API to request
     * @keyword {string} Search bar word
     * @topic {string} Selected topic in the dropdown
     * @sort {string} Selected sort in the dropdown
     * @id {string} Where elements are gonna be appended
     * @return {undefined} No return
     */
    coursesAPI = (keyword, topic, sort, id) => {
        const url = `https://smileschool-api.hbtn.info/courses?q=${keyword}&topic=${topic}&sort=${sort}`;

        showSpinner(id);
        $.get(url)
            .done((response) => {
                cleanHTML(id);
                displayCourses(response);
            })
            .fail((error) => {
                console.error(error);
            });
    };

    $("#keyWords").on("change", function () {
        searchData.keyword = $(this).val();
        filterCourse(searchData);
    });

    /** Uppercases only the first letter of every item in the dropdown
     * @category {array} Array of items to be uppercased
     * @return {array} Array of items uppercased
     */
    dropdownItemToUppercase = (category) => {
        let eachCategory = [];
        let item = "";
        for (let i of category) {
            item = i.charAt(0).toUpperCase() + i.slice(1);
            eachCategory.push(item.split("_").join(" "));
        }

        return eachCategory;
    };

    /** It fills the dropdowns in accordance with its type
     * @{topics, sorts} {object} Destructured object to get correct values
     * @type {string} Choose the dropdown to be filled
     * @return {undefined} No return
     */
    fillDropdown = ({ topics, sorts }, type) => {
        let dropDownId = "";
        let category = "";
        let eachCategory = [];

        if (type === "topic") {
            dropDownId = `${type}Dropdown`;
            category = topics;
            eachCategory = dropdownItemToUppercase(category);
        } else if (type === "sort") {
            dropDownId = `${type}Dropdown`;
            category = sorts;
            eachCategory = dropdownItemToUppercase(category);
        }

        cleanHTML(dropDownId);
        for (let i in category) {
            $(`#${dropDownId}`).append(
                $("<a>")
                    .addClass(`dropdown-item ${type}`)
                    .attr({ href: "#", at: `${category[i]}` })
                    .text(eachCategory[i])
            );
        }

        $(`.${type}`).on("click", function () {
            $(`#${type}Text`).text($(this).text());
            if (type === "topic") {
                searchData.topic = $(this).attr("at");
            } else if (type === "sort") {
                searchData.sort = $(this).attr("at");
            }
            filterCourse(searchData);
        });
    };

    coursesAPI(
        searchData.keyword,
        searchData.topic,
        searchData.sort,
        "courses"
    );

    /** Displays all courses
     * @data {object} Data object from the API
     * @return {undefined} No return
     */
    displayCourses = (data) => {
        console.log(data);
        fillDropdown(data, "topic");
        fillDropdown(data, "sort");

        if (data.courses.length === 0) {
            $("#courses").append(
                $("<div>")
                    .addClass("container text-center")
                    .append(
                        $("<h1>")
                            .text("No results, try another search")
                            .addClass("no-results")
                    )
            );
            $("#results-number").text(`No videos`);
        } else if (data.courses.length === 1) {
            $("#results-number").text(`${data.courses.length} video`);
        } else {
            $("#results-number").text(`${data.courses.length} videos`);
        }

        for (let i in data.courses) {
            const card = $("<div>")
                .addClass("card border-0 mb-4 col-12 col-sm-4 col-lg-3")
                .append(addCards(data.courses[i]));

            $("#courses").append(card);
        }
        $("#stars img:nth-child(1)").removeClass("offset-1");
    };

    filterCourse = ({ keyword, topic, sort }) => {
        coursesAPI(keyword, topic, sort, "courses");
    };
});
