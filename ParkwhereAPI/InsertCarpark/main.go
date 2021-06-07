package main

// https://gist.github.com/owainlewis/2a8b54b94836eded67dfe037608c32a9
// https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/s3compatibleapi.htm
import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"

	"github.com/oracle/oci-go-sdk/v41/common"
	"github.com/oracle/oci-go-sdk/v41/objectstorage"
)

type Carpark struct {
	CarparkID                 string //key
	CarparkName               string
	AvailableLots             string
	Location                  string
	Agency                    string
	VehCat                    string `json:"vehCat"`
	WeekDays_Rate_1           string
	WeekDays_Rate_2           string
	Saturday_Rate             string
	Sunday_PublicHoliday_Rate string
	// Free string
}

// go reads from left to right from name to type

func randSeq(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func putIntoS3(carparkID string, data string, s3Client *s3.S3) {
	// NOTE: set AWS_PROFILE env variable
	bucket := "parkwhere-bucket"
	prefix := "Input/" + carparkID + "/"
	item := randSeq(8) + ".json"
	reader := strings.NewReader(data)
	// uploader := s3manager.NewUploader(sess)
	_, err := s3Client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(prefix + item),
		// here you pass your reader
		// the aws sdk will manage all the memory and file reading for you
		Body: reader,
	})
	if err != nil {
		log.Fatalf("Unable to upload item %q, %v", item, err)
	}
}

func createClient(tenancy, region, accessKey, secretAccessKey string) *s3.S3 {
	endpoint := "https://objectstorage.ap-mumbai-1.oraclecloud.com/p/F6m0PYcHmzaoTwcim5mejhh6K4yhg4cyMP9SgHZTf3zgQZr-stQWRnybutP93lTZ/n/bmgmubm43b7x/b/bucket-20210607-1304/o/"
	c, clerr := objectstorage.NewObjectStorageClientWithConfigurationProvider(common.DefaultConfigProvider())
	s3Config := &aws.Config{
		Credentials:      credentials.NewStaticCredentials(accessKey, secretAccessKey, ""),
		Endpoint:         aws.String(endpoint),
		Region:           aws.String(region),
		S3ForcePathStyle: aws.Bool(true),
	}
	newSession := session.New(s3Config)

	return s3.New(newSession)
}
func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var carpark Carpark
	log.Print(fmt.Sprintf("body:[%s] ", request.Body))
	err := json.Unmarshal([]byte(request.Body), &carpark)
	if err != nil {
		log.Fatalf("Wrong data format")
	}
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-southeast-1")},
	)
	// ask for my keys
	// accessKey := "ocid1.credential.oc1...."
	// secretAccessKey := "M4MivGH9Z0ILEgwpoz60rmg..."
	s3Client := createClient("zach2940", "ap-mumbai-1", accessKey, secretAccessKey)
	putIntoS3(carpark.CarparkID, request.Body, s3Client)
	return events.APIGatewayProxyResponse{
		Body:       "success",
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}

// func main() {
// 	res, _ := HandleRequestTest()
// 	fmt.Println(res)
// }
