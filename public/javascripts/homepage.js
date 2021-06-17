//header-pics show
const pics = document.querySelectorAll(".head-pic");
const picsTimes = {
    fadeinT: 1000,
    delayShow: 3500,
    fadeoutT: 500,
    delayToNext: 0,
};
showItem(2, pics[0], 0, picsTimes);

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

$(".owl-carousel").owlCarousel({
    loop: false,
    margin: 10,
    nav: true,
    rtl: false,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 3,
        },
        1000: {
            items: 5,
        },
    },
});
