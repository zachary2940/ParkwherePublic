import requests
import pandas as pd


url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details"
headers = {'AccessKey': "ask me for my keys","Token":"45R76B9s-cA9-c4WCd2b4NQQGeyMk@Ye7a6Ed1CY48PVPaeS72HeA70993b34JeswAA9eQe6dw2-b94-B0A8evMba383eGKb8Wdm"}
res = requests.get(url, headers=headers)
carparks= res.json()["Result"]
for carpark in carparks:
    if "geometries" in carpark:
        carpark["geometries"] = carpark["geometries"][0]
    else:
        carpark["geometries"] = "-"

df = pd.DataFrame(carparks)
df.to_csv('./carparkrates_URA_parsed.csv')