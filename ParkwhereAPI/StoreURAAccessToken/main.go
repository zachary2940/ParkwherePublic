package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/aws/aws-sdk-go/service/ssm/ssmiface"
)

// go reads from left to right from name to type

var URA_TOKEN_PATH string = "https://www.ura.gov.sg/uraDataService/insertNewToken.action"
var URA_KEY string = "ask me for the keys"

func HandleRequest(ctx context.Context) (string, error) {
	res := "success"
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-southeast-1")},
	)
	// check if token is in ssm parameter store/ expired
	ssmsvc := ssm.New(sess)
	tokenBody, err := APIGetRequestURAToken(URA_TOKEN_PATH, URA_KEY)
	if err != nil {
		log.Fatalln(err)
	}
	var tokenRes map[string]interface{}
	if err := json.Unmarshal(tokenBody, &tokenRes); err != nil {
		log.Fatal(err)
	}
	token := tokenRes["Result"].(string)
	fmt.Println(token)
	parameterName := aws.String("/Parkwhere/URA_ACCESS_TOKEN")
	parameterValue := aws.String(token)
	parameterType := aws.String("String")
	results, err := PutParameter(ssmsvc, parameterName, parameterValue, parameterType)
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(*results.Version)
	return res, nil
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

func PutParameter(svc ssmiface.SSMAPI, name *string, value *string, paramType *string) (*ssm.PutParameterOutput, error) {
	results, err := svc.PutParameter(&ssm.PutParameterInput{
		Name:      name,
		Value:     value,
		Type:      paramType,
		Overwrite: aws.Bool(true),
	})

	return results, err
}

func HandleRequestTest() (string, error) {
	res := "success"
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-southeast-1")},
	)
	// check if token is in ssm parameter store/ expired
	ssmsvc := ssm.New(sess)
	tokenBody, err := APIGetRequestURAToken(URA_TOKEN_PATH, URA_KEY)
	if err != nil {
		log.Fatalln(err)
	}
	var tokenRes map[string]interface{}
	if err := json.Unmarshal(tokenBody, &tokenRes); err != nil {
		log.Fatal(err)
	}
	token := tokenRes["Result"].(string)
	fmt.Println(token)
	parameterName := aws.String("/Parkwhere/URA_ACCESS_TOKEN")
	parameterValue := aws.String(token)
	parameterType := aws.String("String")
	results, err := PutParameter(ssmsvc, parameterName, parameterValue, parameterType)
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(*results.Version)
	return res, nil
}

func main() {
	lambda.Start(HandleRequest)
}

// func main() {
// 	res, _ := HandleRequestTest()
// 	fmt.Println(res)
// }
