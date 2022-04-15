jQuery(document).ready(function($) {

    var scrollWidth = window.innerWidth - document.documentElement.clientWidth;

    $('img, a').on('dragstart', function(event) {
        event.preventDefault();
    });

    function is_touch_device() {
        return !!('ontouchstart' in window);
    }

    $(window).on('load', function() {
        $('.service-item').matchHeight();
        $('.team-item__main').matchHeight();
        $('.review-item__content').matchHeight();
    });

    $('[type="tel"]').mask('+7 (999) 999 99 99');

    $('select').each(function() {
        var select = $(this),
            placeholder = select.attr('data-placeholder');

        if (!select.attr('multiple') && placeholder) {
            select.prepend('<option selected disabled>' + placeholder + '</option>');
        }

        select.SumoSelect({
            placeholder: (placeholder) ? placeholder : 'Выберите пункты',
            // search: true,
            searchText: 'Поиск...',
            noMatch: 'Не найдено "{0}"',
            captionFormat: 'Выбрано пунктов: {0}',
            captionFormatAllSelected: 'Выбраны все пункты',
        });
    });

    // Popups

    function popupArgs(src, type) {
        var args = {
            type: 'inline',
            removalDelay: 500,
            mainClass: 'mfp-zoom-in',
            tClose: 'Закрыть',
            tLoading: 'Загрузка...',
            closeMarkup: '<button title="%title%" class="close-btn ic ic-close" data-popup-close></button>',
            image: {
                tError: '<a href="%url%">Изображение</a> не может быть загружено.'
            },
            callbacks: {
                beforeOpen: function() {
                    this.container[0].classList.add('mfp-with-anim');
                },
                open: function() {
                    $('.scroll-menu').css('margin-right', scrollWidth);
                },
                close: function() {
                    $('.scroll-menu').css('margin-right', '');
                }
            },
        };

        if (type == 'iframe' || type == 'image') args['type'] = type;

        if (type == 'gallery') {

            args['type'] = 'image';
            args['gallery'] = {
                enabled: true,
                navigateByImgClick: false,
                arrowMarkup: '<button title="%title%" class="mfp-custom-arrow ic ic-%dir%"></button>',
                tPrev: 'Назад (или нажмите влево)',
                tNext: 'Далее (или нажмите вправо)',
                tCounter: '%curr% из %total%',
            };

        } else {

            args['items'] = {
                src: src
            };

        }

        return args;
    }

    $('body').on('click', '[data-popup]', function() {
        $.magnificPopup.open(popupArgs($(this).attr('href'), $(this).attr('data-popup')));
        return false;
    });

    $('body').on('click', '[data-popup-close]', function() {
        $.magnificPopup.close();
        return false;
    });

    $('.js-gallery').each(function() {
        $(this).find('a').not('[data-popup]').magnificPopup(popupArgs(false, 'gallery'));
    });

    $('.js-doc-items').each(function() {
        $(this).find('.ic-eye').not('[data-popup]').magnificPopup(popupArgs(false, 'gallery'));
    });

    // Popups END

    // Grids

    var masonryGrids = [];

    function masonryGridsUpdate() {
        for (var i = 0; i < masonryGrids.length; i++) {
            masonryGrids[i].masonry('layout');
        }
    }
    $(window).on('load', function() {
        masonryGridsUpdate();
    });

    var grid = $('.main-menu__list').masonry({
        columnWidth: '.main-menu__list>li',
        itemSelector: '.main-menu__list>li',
        percentPosition: true,
        transitionDuration: 0
    });
    masonryGrids.push(grid);

    // Grids END

    // Header Menu

    var headerMenuTimer;

    function headerMenuReset() {
        $('.header__dropdown-list>ul').each(function() {
            var li = $('.header__menu>li').eq($(this).attr('data-index'));
            $(this).appendTo(li);
            li.removeClass('hover');
        });
        $('.header__dropdown').removeClass('_show');
    }

    function headerMenuliHover(li) {
        var ul = li.find('>ul');

        if (ul.length != 0) {
            li.addClass('hover')
            ul.attr('data-index', li.index()).appendTo('.header__dropdown-list');
            $('.header__dropdown').addClass('_show');
        }
    }

    if (is_touch_device()) {

        $('.header__menu>li>a').click(function() {
            var li = $(this).closest('li');

            if (li.hasClass('hover')) {
                headerMenuReset();
            } else {
                headerMenuReset();
                headerMenuliHover(li);
            }

            return false;
        });

        $(document).on("click", function(e) {
            if (!$('.header__dropdown').is(e.target) && $('.header__dropdown').has(e.target).length === 0) {
                headerMenuReset();
            }
        });

    } else {

        $('.header__menu>li').mouseenter(function() {
            clearTimeout(headerMenuTimer);
            if (!$(this).hasClass('hover')) headerMenuReset();
            headerMenuliHover($(this));
        })

        $('.header__menu').mouseleave(function() {
            headerMenuTimer = setTimeout(function() {
                if (!$('.header__dropdown').is('hover')) headerMenuReset();
            }, 50);
        });

        $('.header__dropdown').mouseenter(function() {
            clearTimeout(headerMenuTimer);
        }).mouseleave(function() {
            headerMenuReset();
        });

    }

    // Header Menu END

    // Scroll & Main Menu

    function scrollMenuScroll() {
        if ($(this).scrollTop() > $('.header').offset().top + $('.header').outerHeight()) $('.scroll-menu').addClass('_show');
        else $('.scroll-menu').removeClass('_show');
    }
    $(window).on('load scroll', function() {
        if ($('.header').length > 0) scrollMenuScroll();
    });

    function mainMenuShow() {
        $('.scroll-menu__toggle').addClass('active');

        $('.main-menu').fadeIn(300);

        $('body').css({
            'overflow': 'hidden',
            'margin-right': scrollWidth
        });

        $('.scroll-menu').css('margin-right', scrollWidth).addClass('_menu-show');

        masonryGridsUpdate();
    }

    function mainMenuClose() {
        $('.scroll-menu__toggle').removeClass('active');

        $('.main-menu').fadeOut(300);

        setTimeout(function() {
            $('body').css({
                'overflow': '',
                'margin-right': ''
            });

            $('.scroll-menu').css('margin-right', '').removeClass('_menu-show');
        }, 300);
    }

    $('.scroll-menu__toggle').click(function() {
        if ($('.main-menu').is(':hidden')) mainMenuShow();
        else mainMenuClose();
    });

    $('.main-menu__list ._dropdown>a').click(function() {
        if (window.matchMedia('(max-width: 767px)').matches) {
            $(this).toggleClass('active');
            $(this).siblings('ul').toggle();

            masonryGridsUpdate();
            return false;
        }
    });

    // Scroll & Main Menu END

    // Sliders

    var sliderIndex = -1;
    var sliders = [];

    function slidersUpdate() {
        setTimeout(function() {
            for (var i = 0; i < sliders.length; i++) {
                if (sliders[i] && sliders[i].$el) sliders[i].update();
            }
        }, 10);
    }
    $(window).on('load', function() {
        slidersUpdate();
    });

    function gridSlider(media, el, args) {
        $(el).each(function() {
            sliderIndex++;

            var slider = '#js-slider-' + sliderIndex;
            var swiperSlider = undefined;

            $(this).attr('id', slider.replace(/#/g, '')).addClass('is-destroy');

            function swiperSliderBegin() {
                if (window.matchMedia('(min-width: ' + (media + 1) + 'px)').matches && swiperSlider != undefined) {

                    swiperSlider.destroy();
                    swiperSlider = undefined;

                    $(slider).addClass('is-destroy');

                } else if (window.matchMedia('(max-width: ' + media + 'px)').matches && swiperSlider == undefined) {

                    swiperSlider = new Swiper(slider, args);

                    $(slider).removeClass('is-destroy');

                    sliders.push(swiperSlider);

                }
            }
            swiperSliderBegin();

            $(window).on('load resize', function() {
                swiperSliderBegin();
            });
        });
    }

    gridSlider(767, '.services-slider', {
        slidesPerView: 'auto',
        spaceBetween: 30,
    });

    function swiperAutoplayFunc(swiper, next) {
        var slideInterval;

        swiper.on('init', function() {
            if (swiper.params.autoplay.enabled == true) {
                $(next).append('<input data-width="100%" data-height="100%" data-displayInput="false" data-fgColor="#FE2937" data-bgColor="transparent" data-thickness=".1" readonly>');
            }
        }).on('init transitionEnd', function() {
            clearInterval(slideInterval);
            if (swiper.params.autoplay.enabled == true) {
                var percent = 1,
                    knobInput = $(next + ' input');

                knobInput.knob();

                slideInterval = setInterval(function() {
                    knobInput.val(percent++).trigger('change');
                }, swiper.params.autoplay.delay / 100);
            }
        })
        $(window).load(function() {
            swiper.init();
        });
    }

    $('.bann-slider').each(function() {
        sliderIndex++;

        var slider = '#js-slider-' + sliderIndex;

        $(this).attr('id', slider.replace(/#/g, ''));

        var swiper = new Swiper(slider + ' .swiper-container', {
            init: false,
            loop: true,
            spaceBetween: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: slider + ' .swiper-button-next',
                prevEl: slider + ' .swiper-button-prev',
            },
            pagination: {
                el: slider + ' .swiper-pagination',
                clickable: true
            },
        });

        swiperAutoplayFunc(swiper, slider + ' .swiper-button-next');

    });

    $('.offers-slider').each(function() {
        sliderIndex++;

        var slider = '#js-slider-' + sliderIndex;

        $(this).attr('id', slider.replace(/#/g, ''));

        var swiper = new Swiper(slider + ' .swiper-container', {
            init: false,
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: slider + ' .swiper-button-next',
                prevEl: slider + ' .swiper-button-prev',
            },
            pagination: {
                el: slider + ' .swiper-pagination',
                clickable: true
            },
            breakpoints: {
                992: {
                    spaceBetween: 18,
                },
                575: {
                    spaceBetween: 15,
                },
            }
        });

        swiperAutoplayFunc(swiper, slider + ' .swiper-button-next');

    });

    $('.reviews-slider').each(function() {
        sliderIndex++;

        var slider = '#js-slider-' + sliderIndex;

        $(this).attr('id', slider.replace(/#/g, ''));

        var swiper = new Swiper(slider + ' .swiper-container', {
            init: false,
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 25,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: slider + ' .swiper-button-next',
                prevEl: slider + ' .swiper-button-prev',
            },
            pagination: {
                el: slider + ' .swiper-pagination',
                clickable: true
            },
            breakpoints: {
                575: {
                    spaceBetween: 15,
                },
            }
        });

        swiperAutoplayFunc(swiper, slider + ' .swiper-button-next');

    });

    $('.gallery-slider').each(function() {
        sliderIndex++;

        var slider = '#js-slider-' + sliderIndex;

        $(this).attr('id', slider.replace(/#/g, ''));

        var swiper = new Swiper(slider + ' .swiper-container', {
            init: false,
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: slider + ' .swiper-button-next',
                prevEl: slider + ' .swiper-button-prev',
            },
            pagination: {
                el: slider + ' .swiper-pagination',
                clickable: true
            },
            breakpoints: {
                992: {
                    spaceBetween: 25,
                },
                575: {
                    spaceBetween: 15,
                },
            }
        });

        swiperAutoplayFunc(swiper, slider + ' .swiper-button-next');

        var items = $(this).find('.swiper-slide').not('.swiper-slide-duplicate').find('a').not('[data-popup]');
        var magnific = items.magnificPopup(popupArgs(false, 'gallery'));

        $(this).on('click', '.swiper-slide-duplicate a:not([data-popup])', function() {
            var i = parseInt($(this).closest('.swiper-slide-duplicate').attr('data-swiper-slide-index'));
            magnific.magnificPopup('open').magnificPopup('goTo', i);
            return false;
        });

    });

    $('.story-item__thumbs').each(function() {
        sliderIndex++;

        var slider = '#js-slider-' + sliderIndex;

        $(this).attr('id', slider.replace(/#/g, ''));

        var swiper = new Swiper(slider, {
            slidesPerView: 3,
            spaceBetween: 25,
            breakpoints: {
                1249: {
                    freeMode: true,
                    slidesPerView: 1,
                    spaceBetween: 25,
                },
                767: {
                    freeMode: true,
                    slidesPerView: 1,
                    spaceBetween: 12,
                },
            }
        });

        sliders.push(swiper);
    });

    new Swiper('.team-slider', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: true,
        navigation: {
            nextEl: '#team-swiper-nav .swiper-button-next',
            prevEl: '#team-swiper-nav .swiper-button-prev',
        },
    });

    // Sliders END

    // Tabs

    $('.tab-btn:first-child').addClass('active');
    $('.tab-btn').click(function() {
        var wrap = $(this).closest('.tab-btns'),
            tabs = wrap.find('.tab-btn'),
            items = wrap.attr('data-items'),
            i = $(this).index();

        items = (items) ? $(items) : wrap.siblings('.tab-items');

        if (items.length > 0) {
            if ($(this).hasClass('active')) return false;

            tabs.removeClass('active').eq(i).addClass('active');
            items.find('.tab-item').hide().eq(i).fadeIn();
        }
    });

    $('.story__tab').click(function() {
        if ($(this).hasClass('active')) return false;

        var i = $(this).index();

        $('.story__tab').removeClass('active').eq(i).addClass('active');
        $('.story-item').hide().eq(i).fadeIn();

        slidersUpdate();
    }).eq(0).addClass('active');

    $('.price__tab').click(function() {
        $('.price__tab').removeClass('active');
        $(this).addClass('active');

        $('.filter__price-toggle').text($(this).text());

        if (window.matchMedia('(max-width: 1249px)').matches) {
            $('.filter__price-toggle').removeClass('active');
            $('.price__tabs').slideUp();
        }
    });
    $('.filter__price-toggle').text($('.price__tab.active').text()).click(function() {
        $(this).toggleClass('active');
        if (window.matchMedia('(max-width: 1249px)').matches) {
            if ($(this).hasClass('active')) $('.price__tabs').slideDown();
            else $('.price__tabs').slideUp();
        }
    });

    // Tabs END

    function servicesCol() {
        if ($('.services__col').length == 0) return false;

        var order = 0;
        var top = $('.services__col').eq(0).offset().top;

        $('.services__col').each(function() {
            if (!$(this).hasClass('_main')) {
                if ($(this).offset().top != top) {
                    order++;
                    top = $(this).offset().top;
                }
                $(this).closest('.services__col').css('order', order);
            }
        });
    }
    $(window).on('load resize', function() {
        servicesCol();
    });

    $('.services__col .service-item').click(function() {
        if ($(this).hasClass('active')) return false;

        servicesCol();

        var grid = $(this).closest('.services__grid');
        var order = $(this).closest('.services__col').css('order');

        $('.service-item').removeClass('active');
        $(this).addClass('active');

        $('.services__col._main').hide();

        grid.find('.services__col._main').show().css('order', order);

        grid.find('.service-main .service-list').remove();

        grid.find('.service-main__head span').text($(this).find('.service-item__head').text());

        $(this).siblings('.service-list').clone().appendTo(grid.find('.service-main'));

        return false;
    });

    $('.address-item__btn').click(function() {
        $(this).toggleClass('active');
        $(this).siblings('.address-item__hidden').slideToggle();
    });

});


document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-form-time') || event.target.classList.contains('form-item__img')) {
            document.querySelector('.time-picker').classList.toggle('time-picker-show');
        }
        if (event.target.classList.contains('time-picker__item')) {
            document.querySelectorAll('.time-picker__item').forEach(el => {
                el.classList.remove('time-picker__item-current')
            });
            event.target.classList.add('time-picker__item-current');
            document.querySelector('.js-form-time').value = event.target.textContent;
            document.querySelector('.time-picker').classList.remove('time-picker-show')
        }
    })
});