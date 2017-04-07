(function (factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.Banner = factory());
}((function () {
    'use strict';

    /**
     * @param option
     * @constructor
     */
    function Banner(option) {
        this.$imgWrapper = option.$imgWrapper;
        this.$pointerWrapper = option.$pointerWrapper;
        this.duration = option.duration || 500;
        this.interval = option.interval || 2000;
        this.bannerWidth = this.$imgWrapper.children().width();
        this.bannerLength = this.$imgWrapper.children().length;
        this.bannerIndex = 0;
        this.timer = 0;

        this.fillingBanner();
        this.initOffset();

        this.eventHandler();
        this.play();
    }

    Banner.prototype.animate = function (offset) {
        const _self = this;
        offset = this.offsetFormat(offset);

        this.$imgWrapper.animate({
            left: offset,
        }, this.duration, () => {
            const currentleft = parseInt(_self.$imgWrapper.css('left'));

            if (currentleft === 0) {
                _self.$imgWrapper.css('left', -_self.bannerWidth * _self.bannerLength);
            } else if (currentleft === -_self.bannerWidth * (_self.bannerLength + 1)) {
                _self.$imgWrapper.css('left', -_self.bannerWidth);
            }
        });
    };

    Banner.prototype.toggleActiveClass = function () {
        this.$pointerWrapper.children().eq(this.bannerIndex).addClass('active').siblings().removeClass('active');
    };

    Banner.prototype.offsetFormat = function (offset) {
        if (offset > 0) {
            return `-=${Math.abs(offset)}`;
        }
        return `+=${ Math.abs(offset)}`;

    };

    Banner.prototype.eventHandler = function () {
        const _self = this;

        this.$imgWrapper.hover(() => {
            _self.stop();
        }, () => {
            _self.play();
        });

        this.$pointerWrapper.on('mouseenter', '.pointer', function () {
            let $pointer = $(this),
                pointerIndex = $pointer.index();

            _self.stop();

            _self.accurate(pointerIndex, $pointer);
        }).on('mouseleave', '.pointer', () => {
            _self.play();
        });
    };

    Banner.prototype.accurate = function (pointerIndex, $pointer) {
        if (this.$imgWrapper.is(':animated') || ($pointer && $pointer.hasClass('active'))) {
            return;
        }
        const offset = (pointerIndex - this.bannerIndex) * this.bannerWidth;

        this.animate(offset);
        this.bannerIndex = pointerIndex;

        if (this.bannerIndex === this.bannerLength) {
            this.bannerIndex = 0;
        } else if (this.bannerIndex === -1) {
            this.bannerIndex = this.bannerLength - 1;
        }
        this.toggleActiveClass();
    };

    Banner.prototype.next = function () {
        this.accurate(this.bannerIndex + 1);
    };

    Banner.prototype.play = function () {
        const _self = this;

        this.timer = setInterval(() => {
            _self.next();
        }, this.interval);
    };

    Banner.prototype.stop = function () {
        clearTimeout(this.timer);
    };

    Banner.prototype.fillingBanner = function () {
        const $lastChild = this.$imgWrapper.find(':last-child').clone();
        const firstChild = this.$imgWrapper.find(':first-child').clone();

        $lastChild.prependTo(this.$imgWrapper);
        firstChild.appendTo(this.$imgWrapper);
    };

    Banner.prototype.initOffset = function () {
        this.$imgWrapper.css('left', -this.bannerWidth);
    };

    return Banner;
})));
