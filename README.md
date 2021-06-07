# Parkwhere
This app displays carparks on the map with indicators of available lots and price, making finding a carpark space easier for its users. This saves countless of hours over time and is a greener and more efficient solution for all
A consensus algorithm takes in the input of multiple users and updates the most recent information in real time
For example, the location of the carpark is shifted to another side of the building. The users can input the correct location and the information is updated after a consensus is reached. Data analytics is also done to determine the busy periods of each carpark.

## Tech
This project uses React Native with js/ts and expo for the front end and golang/python for the backend. It also uses oracle buckets and other cloud services for serverless architecture. The data is taken from data.gov.sg real time and static APIs and LTA/URA APIs.

Oracle was used for storing carpark rates

https://objectstorage.ap-mumbai-1.oraclecloud.com/p/SYaAYt0Yy1AmEbMMUkZgzE6MIKG0N2HmsY1I3zofVfjY4WBn8VT8yf64isU0T0MT/n/bmgmubm43b7x/b/bucket-20210607-1304/o/carparkRatescar_LTA_sgcarmart.json

## References
  https://medium.com/how-to-react/how-to-use-redux-with-react-hooks-and-axios-a78d942fbe9c
  https://blog.logrocket.com/designing-a-ui-with-custom-theming-using-react-native-paper/
  https://github.com/Karniej/Crypto-Info
  https://gist.github.com/graydon/11198540



## Start Instructions
```yarn install```

```expo start```




