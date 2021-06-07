package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

var LTA_API_PATH string = "http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2?"
var LTA_KEY string = "ask me for the keys"
var URA_TOKEN_PATH string = "https://www.ura.gov.sg/uraDataService/insertNewToken.action"
var URA_AVAILABILITY_PATH string = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability"
var URA_KEY string = "ask me for the keys"

func APIGetRequestLTA(path string, key string) ([]byte, error) {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", path, nil)
	req.Header.Set("AccountKey", key)
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

type LTACarparkJSON struct {
	Odatametadata string    `json:"odata.metadata"`
	Value         []Carpark `json:"value"`
}

type Carpark struct {
	CarParkID     string
	Area          string
	Development   string
	Location      string
	AvailableLots int
	LotType       string
	Agency        string
}

func ParseLTAData(body string) []Carpark {
	var result LTACarparkJSON
	json.Unmarshal([]byte(body), &result)
	carparks := result.Value
	return carparks
}

func sortLTAData(carparks []Carpark, vehicle string) []Carpark {
	VEHICLE_MAP := map[string]string{
		"car":           "C",
		"motorcycle":    "Y",
		"heavy_vehicle": "H",
	}
	// sorting between car, motorcycle and
	fmt.Println("Total Number of Carparks: ", len(carparks))
	var carparksClean = make([]Carpark, 0)

	for i := 0; i < len(carparks); i++ {
		if carparks[i].LotType == VEHICLE_MAP[vehicle] && carparks[i].Agency != "URA" {
			carparksClean = append(carparksClean, carparks[i])
		}
	}

	fmt.Println("Number of Carparks: ", len(carparksClean))

	return carparksClean
}

type URACarparkJSON struct {
	Status  string
	Message string
	Result  []URACarpark
}

type URACarpark struct {
	LotsAvailable string `json:"lotsAvailable"`
	LotType       string `json:"lotType"`
	CarparkNo     string `json:"carparkNo"`
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
		"car":           "C",
		"motorcycle":    "M",
		"heavy_vehicle": "H",
	}
	// sorting between car, motorcycle and
	fmt.Println("Total Number of Carparks: ", len(carparks))
	var carparksClean = make([]URACarpark, 0)

	for i := 0; i < len(carparks); i++ {
		if carparks[i].LotType == VEHICLE_MAP[vehicle] {
			carparksClean = append(carparksClean, carparks[i])
		}
	}
	fmt.Println("Number of URA Carparks: ", len(carparksClean))
	return carparksClean
}

type Response struct {
	Data string `json:"data"`
}

func packageResponse(carparks []Carpark) string {
	carpark_str, _ := json.Marshal(carparks)
	resObj := Response{Data: string(carpark_str)}
	res, _ := json.Marshal(resObj)
	return string(res)
}

func packageResponseURA(carparks []URACarpark) string {
	carpark_str, _ := json.Marshal(carparks)
	resObj := Response{Data: string(carpark_str)}
	res, _ := json.Marshal(resObj)
	return string(res)
}
