import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Fontisto';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const API_KEY = '';

const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Rain: 'rains',
  Drizzle: 'rain',
  Thunderstorm: 'lightning',
};

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState<any[]>([]);

  const fetchCityName = async (latitude: number, longitude: number) => {
    try {
      const days_response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`,
      );
      const days_data = await days_response.json();
      setDays(days_data.daily);
      const city_response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`,
      );
      const city_data = await city_response.json();
      setCity(city_data.name);
    } catch (error) {
      console.error('Error fetching city name:', error);
    }
  };

  const getLocation = async () => {
    Geolocation.requestAuthorization('whenInUse').then(status => {
      if (status === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            fetchCityName(latitude, longitude);
          },
          error => {
            console.error(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.error('Location permission denied');
      }
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{marginTop: 10}}
            />
          </View>
        ) : (
          days.map((arr, idx) => (
            <View key={idx} style={styles.day}>
              <View>
                <Text style={styles.temp}>
                  {parseFloat(arr.temp.day).toFixed(1)}
                </Text>
                <Text style={styles.description}>{arr?.weather[0]?.main}</Text>
                <Text style={styles.tinyText}>
                  {arr?.weather[0]?.description}
                </Text>
              </View>
              <View style={styles.weatherIcon}>
                <Icon
                  name={icons[arr.weather[0].main]}
                  size={100}
                  color="white"
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 45,
    fontWeight: '500',
    color: '#fff',
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  temp: {
    fontWeight: '600',
    fontSize: 108,
    color: '#fff',
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: '#fff',
  },
  tinyText: {
    fontSize: 20,
    color: '#fff',
  },
  weatherWrap: {
    flexDirection: 'row',
  },
  weatherIcon: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
});
