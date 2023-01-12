from fastapi import FastAPI, File, Form, UploadFile
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import os
import base64

import cv2
import numpy as np 
import matplotlib.pyplot as plt 
import json

app = FastAPI()

origin = [ "*" ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath("image"))
IMG_DIR = os.path.join(BASE_DIR,'backend\image')
SAVE_DIR = os.path.join(BASE_DIR,'react\drawer\public\img')

@app.post("/files/")
async def create_file(file: bytes=File(), filename: str=Form(...)):
    json_contours = []
    with open("./backend/image/"+filename, "wb") as fh:
        # fh.write(base64.decodebytes(file))
        fh.write(file)
        contours = getContours(filename)['contour']
        # img = getContours(filename)['image']
        for contour in contours:
            json_contour = json.dumps(contour.tolist())
            json_contours.append(json_contour)

    return { 
            "file_len" : len(file),
            "con" : json_contours,
            'filename' : filename 
            }

def check_empty_img(url):
    image = cv2.imread(url)
  
    if image is None:
        result = "Image is empty!!"
    else:
        result = "Image is not empty!!"
    return result

def getContours(filename):
    path = os.path.join(IMG_DIR, filename)

    result = check_empty_img(path)
    print(result)

    image = cv2.imread(path)

    image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(image_gray, 50, 255, 0)
    thresh = cv2.bitwise_not(thresh)

    # plt.imshow(cv2.cvtColor(thresh, cv2.COLOR_GRAY2RGB))
    # plt.imshow(image_gray,cmap="gray").show()


    contours,hier = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    image = cv2.drawContours(image, contours, -1,(0, 0, 255), 4, cv2.LINE_8, hier)

    
    # print(contours[0][0]) #첫번째 좌표의 x,y
    print("contours = ", contours)

    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    # plt.show()
    cv2.imwrite(SAVE_DIR+'\\'+filename, image)

    return {
            "contour": contours,
            }

if __name__ == "__main__":
    uvicorn.run("main:app")