import os
import cv2
import numpy as np 
import matplotlib.pyplot as plt 

# path = os.path.join('D:\\','test3.png')
# path = os.path.join('D:\\','imageToSave.png')
path = os.path.join('D:\\project\\canvas\\backend\\image\\','test3.png')
# path = "D:\\project\\canvas\\backend\\image\\imageToSave.png"
image = cv2.imread(path)

image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
ret, thresh = cv2.threshold(image_gray, 230, 255, 0)
thresh = cv2.bitwise_not(thresh)

plt.imshow(cv2.cvtColor(thresh, cv2.COLOR_GRAY2RGB))
plt.show()

contours,hier = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
image = cv2.drawContours(image, contours, -1,(0, 0, 255), 4, cv2.LINE_8, hier)

print(contours[0][0]) #첫번째 좌표의 x,y 값

plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.show()


# contour = contours[0]
# x, y, w, h = cv2.boundingRect(contour)
# image = cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 3)

# plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
# plt.show()