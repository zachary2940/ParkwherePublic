import pandas as pd
import json

def join_LTA_SGCarMart():
    df = pd.read_csv('./sgcarmart_static_location.csv')
    df1 = pd.read_csv('./carparkrates_LTA_static_location.csv')
    # df1.rename(columns = {'CarParkID':'carparkNo'}, inplace = True)
    print(df)
    print(df1)
    df1 = df1.drop_duplicates(subset=['CarPark'])
    print(df1)
    # print(df1.loc[df1["Agency"]=='URA'])
    # get joined rows with correct prices
    df_com = df.merge(df1[["CarPark", "Category"]], on='CarPark', how='outer')
    # df_com = df.merge(df1, on='CarPark', how='outer')

    df_nan = df_com[df_com["WeekDays_Rate_1"].isnull()]
    df_nan_filled = df1.merge(df_nan[["CarPark"]], on='CarPark', how='inner')
    print(df_nan_filled)
    df_com = df_com.set_index('CarPark')
    df_nan_filled = df_nan_filled.set_index('CarPark')
    df_com.update(df_nan_filled)
    df_com.reset_index(inplace=True)
    print(df_com)

    convertToJson(df_com,'car_LTA_sgcarmart.json')
    # df_com.to_csv('./outerjoinLTAsgcarmart.csv', index=False)

def convertToJson(df,filename):
    result = df.to_json(orient="records")
    jsonObj = json.loads(result)
    with open(filename, 'w') as f:
        json.dump(jsonObj, f)  


# df = pd.read_csv('./carparkrates_URA_parsed.csv',index_col=0)
import requests


url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details"
headers = {'AccessKey': "ask me","Token":"bU+66dvyf+Rm-0m9+xb3cHVam9MnUsRrEayeExU-X-xudvCB0D45G4y8g3329Nr44pMScb9DM499c30+cuNeGqQG@p466K9q7J8N"}
res = requests.get(url, headers=headers)
carparks= res.json()["Result"]
print(carparks)
# df = pd.read_json(carparks)
# print(df)
import json
car_json = []
for carpark in carparks:
    if carpark["vehCat"]=='Car':
        car_json.append(carpark)

print(car_json)

with open('car_URA.json','w') as f:
    json.dump(car_json,f)


# df = pd.DataFrame(carparks)

# df["geometries"] = df["geometries"].apply(lambda x:x.replace("'",'"'))
# df = df.loc[df["vehCat"]=='Motorcycle']
# print(df)
# convertToJson(df,'motorcycle_URA.json')
