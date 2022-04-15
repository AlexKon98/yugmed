jQuery(document).ready(function($) {

  var mapArr = [{
      'coord': [48.71492057379572, 44.503976499999915],
      'head': 'Клиника на Кубанской',
      'content': '<div class="yug-balloon__item"><i class="ic ic-mark"></i>Волгоград, ул. Невская, 13а <br>пн-пт с 08.00 до 18.00, сб с 09.00 до 14.00</div><div class="yug-balloon__item"><i class="ic ic-phone"></i><a href="tel:+78442260360">+7(8442) 260-360</a></div>'
    },
    {
      'coord': [48.715235573796505, 44.490447999999994],
      'head': 'Клиника на Ангарской',
      'content': '<div class="yug-balloon__item"><i class="ic ic-mark"></i>Волгоград, ул. Невская, 13а <br>пн-пт с 08.00 до 18.00, сб с 09.00 до 14.00</div><div class="yug-balloon__item"><i class="ic ic-phone"></i><a href="tel:+78442260360">+7(8442) 260-360</a></div>'
    },
    {
      'coord': [48.71797557380354, 44.50748899999997],
      'head': 'Клиника на Невской',
      'content': '<div class="yug-balloon__item"><i class="ic ic-mark"></i>Волгоград, ул. Невская, 13а <br>пн-пт с 08.00 до 18.00, сб с 09.00 до 14.00</div><div class="yug-balloon__item"><i class="ic ic-phone"></i><a href="tel:+78442260360">+7(8442) 260-360</a></div>'
    },
    {
      'coord': [48.69509157379899, 44.49119349999988],
      'head': 'Детская поликлиника',
      'content': '<div class="yug-balloon__item"><i class="ic ic-mark"></i>Волгоград, ул. Невская, 13а <br>пн-пт с 08.00 до 18.00, сб с 09.00 до 14.00</div><div class="yug-balloon__item"><i class="ic ic-phone"></i><a href="tel:+78442260360">+7(8442) 260-360</a></div>'
    },
  ];

  var mainMap;

  if ($("#main-map").length > 0) ymaps.ready(mainMapInit);

  function mainMapInit() {

    mainMap = new ymaps.Map("main-map", {
      center: [48.708077945693255, 44.504319822753835],
      zoom: 13,
      controls: ["fullscreenControl"],
    });

    mainMap.controls.add('zoomControl', {
      float: 'none',
      position: {
        top: '8px',
        left: '8px'
      }
    });

    $.each(mapArr, function(index, value) {
      var squareLayout = ymaps.templateLayoutFactory.createClass('<div id="yug-mark-' + index + '" class="yug-mark"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="46" viewBox="0 0 35 46" class="yug-mark__svg"><path d="M0,5A5,5,0,0,1,5,0H30a5,5,0,0,1,5,5V30.11a5,5,0,0,1-5,5H27.1a5,5,0,0,0-4.3,2.46L21,40.65l-3,5a.61.61,0,0,1-1.07,0L12.2,37.6a5,5,0,0,0-4.31-2.47H5a5,5,0,0,1-5-5Z" class="yug-mark__path" /><path d="M13,14H8.59c-.07,0-.09,0-.09.09v4.4c0,.06,0,.08.09.08h8.92v9H22c.07,0,.09,0,.09-.09V23.09H26.5V18.55H17.6c-.07,0-.09,0-.09-.08V9.53H13Z" fill="#fff" fill-rule="evenodd"/></svg></div>');

      MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="yug-balloon">' +
        '<a class="close-btn ic ic-close" href="#"></a>' +
        '<div class="arrow"></div>' +
        '$[[options.contentLayout observeSize maxWidth=280]]' +
        '</div>', {
          build: function() {
            this.constructor.superclass.build.call(this);
            this._$element = $('.yug-balloon', this.getParentElement());
            this.applyElementOffset();
            this._$element.find('.close-btn').on('click', $.proxy(this.onCloseClick, this));
          },
          clear: function() {
            this._$element.find('.close-btn').off('click');
            this.constructor.superclass.clear.call(this);
          },
          onSublayoutSizeChange: function() {
            MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
            if (!this._isElement(this._$element)) {
              return;
            }
            this.applyElementOffset();
            this.events.fire('shapechange');
          },
          applyElementOffset: function() {
            this._$element.css({
              // left: -(this._$element[0].offsetWidth / 2),
              // top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
							left: 15,
							top: 0
            });
          },
          onCloseClick: function(e) {
            e.preventDefault();
            this.events.fire('userclose');
          },
          getShape: function() {
            if (!this._isElement(this._$element)) {
              return MyBalloonLayout.superclass.getShape.call(this);
            }
            var position = this._$element.position();
            return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
              [position.left, position.top],
              [
                position.left + this._$element[0].offsetWidth,
                position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
              ]
            ]));
          },
          _isElement: function(element) {
            return element && element[0] && element.find('.arrow')[0];
          }
        });

      MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h6 class="yug-balloon__head">$[properties.balloonHeader]</h6>' +
        '<div class="yug-balloon__content">$[properties.balloonContent]</div>'
      );

      var squarePlacemark = new ymaps.Placemark(value['coord'], {
        balloonHeader: value['head'],
        balloonContent: value['content'],
        hintContent: ''
      }, {
        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        hideIconOnBalloonOpen: false,
        balloonOffset: [25, -48],

        iconLayout: squareLayout,
        iconShape: {
          type: 'Rectangle',
          coordinates: [
            [-17.5, -46],
            [17.5, 0]
          ]
        }
      });
      mainMap.geoObjects.add(squarePlacemark);

      squarePlacemark.events.add('mouseenter', function() {
        $('#yug-mark-' + index).addClass('hover');
      }).add('mouseleave', function() {
        $('#yug-mark-' + index).removeClass('hover');
      }).add('click', function() {
        $('.yug-mark').removeClass('active');
        setTimeout(function() {
          if (mainMap.balloon.isOpen()) $('#yug-mark-' + index).addClass('active');
        }, 50);
      });

    });

    mainMap.balloon.events.add('close', function() {
      $('.yug-mark').removeClass('active');
    });

    // Выставляем масштаб карты чтобы были видны все группы.
    // mainMap.setBounds(mainMap.geoObjects.getBounds());

  };

});
