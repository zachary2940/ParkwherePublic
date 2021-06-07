package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

var URA_TOKEN_PATH string = "https://www.ura.gov.sg/uraDataService/insertNewToken.action"
var URA_RATES_PATH string = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details"
var URA_KEY string = "ask me for the keys"

type Response struct {
	Data string `json:"data"`
}

func packageResponse(data string) string {
	resObj := Response{Data: data}
	res, _ := json.Marshal(resObj)
	return string(res)
}

func fetchFromS3(agency string, vehicle string, sess *session.Session) string {
	// NOTE: set AWS_PROFILE env variable

	ITEM_MAP := map[string]map[string]string{
		"LTA": {
			"car":        "car_LTA_sgcarmart.json",
			"motorcycle": "motorcycle_sgbikeparking.json",
		},
		"URA": {
			"car":        "car_URA.json",
			"motorcycle": "motorcycle_URA.json",
		},
	}
	bucket := "parkwhere-bucket"
	prefix := agency + "/" + vehicle + "/"
	item := ITEM_MAP[agency][vehicle]

	buff := &aws.WriteAtBuffer{}
	downloader := s3manager.NewDownloader(sess)
	_, err := downloader.Download(buff,
		&s3.GetObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(prefix + item),
		})
	data := buff.Bytes() // now data is my []byte array

	if err != nil {
		log.Fatalf("Unable to download item %q, %v", item, err)
	}

	return string(data)
}

func APIGetRequestURAToken(path string, key string) ([]byte, error) {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", path, nil)
	req.Header.Set("AccessKey", key)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err) //Fatalln is equivalent to Println() followed by a call to os.Exit(1).
	}
	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(resp.Body)
	return body, err
}

func APIGetRequestURA(path string, key string, token string) ([]byte, error) {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", path, nil)
	req.Header.Set("AccessKey", key)
	if token != "" {
		req.Header.Set("Token", token)
	}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err) //Fatalln is equivalent to Println() followed by a call to os.Exit(1).
	}
	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(resp.Body)
	return body, err
}

type URACarparkJSON struct {
	Status  string
	Message string
	Result  []URACarpark
}

type URACarpark struct {
	WeekdayMin    string `json:"weekdayMin"`
	PpName        string `json:"ppName"`
	EndTime       string `json:"endTime"`
	WeekdayRate   string `json:"weekdayRate"`
	StartTime     string `json:"startTime"`
	PpCode        string `json:"ppCode"`
	SunPHRate     string `json:"sunPHRate"`
	SatdayMin     string `json:"satdayMin"`
	SunPHMin      string `json:"sunPHMin"`
	ParkingSystem string `json:"parkingSystem"`
	ParkCapacity  int    `json:"parkCapacity"`
	VehCat        string `json:"vehCat"`
	SatdayRate    string `json:"satdayRate"`
	Geometries    []struct {
		Coordinates string `json:"coordinates"`
	} `json:"geometries"`
}

func ParseURAData(body []byte) []URACarpark {
	var result URACarparkJSON
	json.Unmarshal(body, &result)
	carparks := result.Result
	return carparks
}

func sortURAData(carparks []URACarpark, vehicle string) []URACarpark {
	VEHICLE_MAP := map[string]string{
		"car":           "Car",
		"motorcycle":    "Motorcycle",
		"heavy_vehicle": "Heavy Vehicle",
	}
	// sorting between car, motorcycle and
	fmt.Println("Total Number of Carparks: ", len(carparks))
	var carparksClean = make([]URACarpark, 0)

	for i := 0; i < len(carparks); i++ {
		if carparks[i].VehCat == VEHICLE_MAP[vehicle] {
			carparksClean = append(carparksClean, carparks[i])
		}
	}
	fmt.Println("Number of URA Carparks: ", len(carparksClean))
	return carparksClean
}

func packageResponseURA(carparks []URACarpark) string {
	carpark_str, _ := json.Marshal(carparks)
	resObj := Response{Data: string(carpark_str)}
	res, _ := json.Marshal(resObj)
	return string(res)
}
