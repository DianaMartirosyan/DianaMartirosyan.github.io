import { useState, useEffect, useRef } from 'react';
import styles from './Wether.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import SearchIcon from '@mui/icons-material/Search';
import ReactAnimatedWeather from 'react-animated-weather';



function Wether() {
    let [inputValue, setInputValue] = useState('');
    let [chengedValue, setChangedValue] = useState('');
    let [list, setList] = useState([]);
    let [currentD, setCurrentD] = useState([]);
    let [imgSrc, setImgSrc] = useState();
    let [cards, setCards] = useState();
    let [show, setShow] = useState(false)
    let [allData, setAllData] = useState([])
    let target = useRef(null);

    let animatIcon = ''
    let colorIcon = ''

    let handleChange = (e) => {
        setInputValue(e.target.value)

    };


    let handleClick = (value) => {
        let upperCase = value[0].toUpperCase() + value.slice(1)
        setChangedValue(upperCase)
        setCards(upperCase)
        setShow(true)
        setInputValue('')
    }


    useEffect(() => {
        if (chengedValue !== '') {
            // Call Current date API *************************************
            fetch('https://api.openweathermap.org/data/2.5/weather?q=' + chengedValue + '&units=metric&lang=am&appid=a9bf867f9c754af4658bdf5650996389')
                .then(res => res.json())
                .then((data) => {
                    setImgSrc(data.weather[0].icon + '.png')
                    setCurrentD({
                        ...data,
                        currentTemp: Math.round(data.main.temp) + '°',
                        currentDescription: data.weather[0].main
                    })
                });


            // Call 5 days weather API *************************************
            fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + chengedValue + '&units=metric&appid=a9bf867f9c754af4658bdf5650996389')
                .then(res => res.json())
                .then((res) => {
                    setList({
                        obj: res.list.map((data, i) => {
                            const newDate = new Date(data.dt_txt);
                            allData[i] = {
                                fullDate: newDate.toDateString().slice(0, 10),
                                description: data.weather[0].description,
                                myIcon: data.weather[0].icon + '.png',
                                temp: Math.round(data.main.temp) + '°',
                                hour: `${newDate.getHours()}`,
                                cityName: res.city.name,
                            }
                        })
                    })
                })
        }
    }, [chengedValue])


    // Animation weather icons *******************************
    let d = new Date()
    let hour = d.getHours()

    //Icon colors
    if (hour > 19) {
        colorIcon = 'black'
    } else {
        colorIcon = 'lightblue'
    }


    ReactAnimatedWeather.defaultProps = {
        animate: true,
        size: 15,
        color: 'black'
    };

    if (currentD.currentDescription == 'Clouds') {
        animatIcon = 'CLOUDY'
    }

    if (currentD.currentDescription == 'Clear') {
        if (hour > 19) {
            animatIcon = 'CLEAR_NIGHT'

        } else {
            animatIcon = 'CLEAR_DAY'
        }
    }

    if (currentD.currentDescription == 'Rain') {
        animatIcon = 'RAIN'
    }

    const defaults = {
        icon: animatIcon,
        color: colorIcon,
        size: 98,
        animate: true
    };


    return (
        <>
            <div className={styles.section}>
                <h1 className={styles.title}>
                    Weather
                </h1>

                <div className={styles.inputGroups}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Enter a city ex. Yerevan"
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleClick(inputValue)}
                        />

                        <Button ref={target} variant="outline-secondary" id="button-addon2" className={styles.search}
                            onClick={() => handleClick(inputValue)}

                        >
                            <SearchIcon />
                        </Button>
                    </InputGroup>
                </div>


                {show && currentD.name === chengedValue &&
                    <Card style={{ width: '18rem' }} className={styles.cards}>
                        <Card.Header className={styles.cityName}> {currentD.name}</Card.Header>
                        <Card.Body>
                            <h1 className={styles.currentTemp}>
                                <span> Now</span> {currentD.currentTemp}
                            </h1>
                            <div className={styles.currentDescription}>
                                <Card.Title>{currentD.currentDescription}</Card.Title>

                                <ReactAnimatedWeather
                                    icon={defaults.icon}
                                    color={defaults.color}
                                    size={defaults.size}
                                    animate={defaults.animate}
                                />
                            </div>
                            <p className={styles.otherInfo}>
                                <span> Humidity   {currentD.main.humidity}</span>
                                <span>Pressure  {currentD.main.pressure} </span>
                            </p>

                        </Card.Body>
                    </Card>
                }


                {/* ************ 5 days ********************************* */}

                <div className={styles.flex_blocks}>
                    {allData.map((item, i) => {

                        return (
                            <div key={i}  >
                                {item.hour == 15 && chengedValue == item.cityName &&
                                    <div className={styles.block}>
                                        <p className={styles.fiveDate}> {item.fullDate}</p>
                                        <p className={styles.fiveDaysTemp}>{item.temp} </p>
                                        <p >{item.description} </p>
                                        <img src={`http://openweathermap.org/img/wn/${item.myIcon} `} />
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
};


export default Wether