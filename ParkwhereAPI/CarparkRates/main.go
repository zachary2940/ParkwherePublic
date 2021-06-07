package main

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
)

// go reads from left to right from name to type

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	vehicle := request.QueryStringParameters["vehicle"]
	agency := request.QueryStringParameters["agency"]
	res := "Malformed Query"
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-southeast-1")},
	)
	switch agency {
	case "LTA":
		data := fetchFromS3(agency, vehicle, sess)
		res := packageResponse(data)
		return events.APIGatewayProxyResponse{
			Body:       res,
			StatusCode: 200,
		}, nil
	case "URA":
		data := fetchFromS3(agency, vehicle, sess)
		res := packageResponse(data)
		return events.APIGatewayProxyResponse{
			Body:       res,
			StatusCode: 200,
		}, nil
	case "URA_SOURCE":
		// check if token is in ssm parameter store/ expired
		ssmsvc := ssm.New(sess)
		param, err := ssmsvc.GetParameter(&ssm.GetParameterInput{
			Name:           aws.String("/Parkwhere/URA_ACCESS_TOKEN"),
			WithDecryption: aws.Bool(false),
		})
		if err != nil {
			log.Fatalln(err)
		}
		token := *param.Parameter.Value
		fmt.Println(token)
		bodyURA, err := APIGetRequestURA(URA_RATES_PATH, URA_KEY, token)
		if err != nil {
			log.Fatalln(err)
		}
		URACarparks := ParseURAData(bodyURA)
		sortedCarparks := sortURAData(URACarparks, vehicle)
		res := packageResponseURA(sortedCarparks)
		return events.APIGatewayProxyResponse{
			Body:       res,
			StatusCode: 200,
		}, nil
	default:
		log.Fatal("Malformed query string")
	}

	return events.APIGatewayProxyResponse{
		Body:       res,
		StatusCode: 200,
	}, nil
}

func HandleRequestTest() (string, error) {
	vehicle := "car"
	agency := "URA"
	res := "Malformed Query"
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-southeast-1")},
	)
	switch agency {
	case "LTA":
		data := fetchFromS3(agency, vehicle, sess)
		res := packageResponse(data)
		return res, nil
	case "URA":
		data := fetchFromS3(agency, vehicle, sess)
		res := packageResponse(data)
		return res, nil
	case "URA_SOURCE":
		ssmsvc := ssm.New(sess)
		param, err := ssmsvc.GetParameter(&ssm.GetParameterInput{
			Name:           aws.String("/Parkwhere/URA_ACCESS_TOKEN"),
			WithDecryption: aws.Bool(false),
		})
		if err != nil {
			log.Fatalln(err)
		}
		token := *param.Parameter.Value
		fmt.Println(token)
		bodyURA, err := APIGetRequestURA(URA_RATES_PATH, URA_KEY, token)
		if err != nil {
			log.Fatalln(err)
		}
		URACarparks := ParseURAData(bodyURA)
		sortedCarparks := sortURAData(URACarparks, vehicle)
		res := packageResponseURA(sortedCarparks)
		return res, nil
	default:
		log.Fatal("Malformed query string")

	}
	return res, nil
}

func main() {
	lambda.Start(HandleRequest)
}

// func main() {
// 	res, _ := HandleRequestTest()
// 	fmt.Println(res)
// }
