const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const body = $('body')
const app = $('.app');
const inputSearch = $('.app-search__input');
const appContent = $('.app-content');
const appContentError = $('.app-content-error');
const dateElement = $('.app-title__date');
const appDetailItemConainer = $('.app-detail__item_conainer');
const tempertureElementText = $('.app-temperture__text span');
const appTitleProvince = $('.app-title__province');

const appWeather = (() => {
    const season = {
        'spring': 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
        'summer': 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
        'autumn': 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhbGx8ZW58MHx8MHx8&auto=format&fit=crop&w=1200&q=60',
        'winter': 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    }
    function changeBackgroundApp(isTemperture) {
        //Mùa xuân
        if(isTemperture >= 10 && isTemperture <= 15){
            app.style.backgroundImage = `url(${season.spring})`;
            body.style.backgroundImage = `url(${season.spring})`;
        }
        //Mùa hạ
        if(isTemperture >= 20 && isTemperture <= 40){
            app.style.backgroundImage = `url(${season.summer})`;
            body.style.backgroundImage = `url(${season.summer})`;
        }
        //Mùa thu
        if(isTemperture >= 10 && isTemperture < 20){
            app.style.backgroundImage = `url(${season.autumn})`;
            body.style.backgroundImage = `url(${season.autumn})`;
        }
        //Mùa đông
        if(isTemperture >= -50 && isTemperture < 10){
            app.style.backgroundImage = `url(${season.winter})`;
            body.style.backgroundImage = `url(${season.winter})`;
        }
    }
    function getDate () {
        setInterval(() => {
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let hour = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            if(day < 10){
                day = '0' + day;
            }
            if(month < 10){
                month = '0' + month;
            }
            if(hour < 10){
                hour = '0' + hour;
            }
            if(minutes < 10){
                minutes = '0' + minutes;
            }
            if(seconds < 10){
                seconds = '0' + seconds;
            }
            const time = `${hour}:${minutes}:${seconds}`;
            const dateString = `${day}/${month}/${year}`;
            dateElement.innerText = dateString + ' ' + time;
        },1000);
    }
    function getWeather () {
        let cityName = inputSearch.value.trim() || 'Mỹ Tho';
        const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=93edfade0000b766e5bbadb4d4fcdddd`;
        fetch(api)
        .then(res => res.json())
        .then(data => {
            if(data.cod === 200){
                appContent.classList.remove('hide');
                appContentError.classList.remove('open');
                const temperture = Math.round(data.main.temp - 273.15);
                const sunrise = data.sys.sunrise;
                const datesunrise = new Date(sunrise * 1000);
                const dateSunrise = datesunrise.toLocaleTimeString();
                const sunset = data.sys.sunset;
                const datesunset = new Date(sunset * 1000);
                const dateSunset = datesunset.toLocaleTimeString();
                const wind = data.wind.speed ? data.wind.speed + ' m/s' : 'Không có';
                const seaLevel = data.main.sea_level ? data.main.sea_level + ' m' : 'Không có';
                const humidity = data.main.humidity ? data.main.humidity + ' %' : 'Không có';
                const listItems = [dateSunrise,dateSunset,wind,seaLevel, humidity];
                const listItemsIcon = ["bx bxs-sun", "bx bx-sun", "bx bx-wind", "fas fa-water", "bx bxs-color-fill"];
                
                appTitleProvince.innerText = data.name + ', ' + data.sys.country;
                tempertureElementText.innerText = temperture;
                changeBackgroundApp(temperture);
                const htmlsDetail = listItems.map((item, index) => {
                    return `
                    <div class="app-detail__item">
                        <div class="detail-item__icon">
                            <i class="${listItemsIcon[index]}"></i>
                        </div>
                        <div class="detail-item__text">
                            <p class="detail-item__text-title">${item}</p>
                        </div>
                    </div>
                    `
                })
                appDetailItemConainer.innerHTML = htmlsDetail.join('');
            }else{
                appContent.classList.add('hide');
                appContentError.classList.add('open');
            }
        })
        .catch(err => console.log(err));
        inputSearch.value = '';
    }
    inputSearch.addEventListener('keyup', (e) => {
        if(e.keyCode === 13){
            getWeather();
        }
    })
    return {
        init: () => {
            changeBackgroundApp();
            getDate();
            getWeather();
        }
    }
})();
appWeather.init();