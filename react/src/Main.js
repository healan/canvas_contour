import React, { useRef, useState, useEffect } from 'react';
import './drawer.css';
import testimg from './image/test.png';
import test1img from './image/test_1.png';
import test2img from './image/test_2.png';
import backgroundImg from './image/background.jpg';
import axios from 'axios';

export default function Drawer(){
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const backcanvasRef = useRef(null);
    const backcontextRef = useRef(null);

    const [ctx, setCtx] = useState();
    const [backctx, setBackCtx] = useState();

    const [contours, setContours] = useState();
    const [sampleImg, setSampleImg] = useState(test2img);
    const [resImg, setResImg] = useState(null);

    const img = new Image();
    const backimg = new Image();

    let polygonxy=[];
    let drawxy = {};
    let drawingMode; // true일 때만 그리기

    const downHandler = () => {
        drawingMode = true;
    };

    const upHandler = () => {
        drawingMode = false;
    };

    const moveHandler = (e) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        
        if (!drawingMode) return;

        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x,y);
        ctx.stroke();
        
        drawxy = {
          x : x,
          y : y
        };
       
        polygonxy.push(drawxy);
        // console.log('폴리건 좌표', polygonxy);
    };

    const setColor = (e) => {
        const colorVal = e.target.getAttribute('data-color');
        ctx.strokeStyle = colorVal;
        ctx.globalAlpha = "0.3"; //투명도 설정 
    };

    const clearCanvas = (e) => {
        ctx.clearRect(0,0,600,500);
        img.src = sampleImg;
        img.onload = () => {
            ctx.drawImage(img,0,0,600,500);
        };
        polygonxy = [];
    };

    const hideImage = (e) => {
        backctx.clearRect(0,0,600,500);
        backimg.src = backgroundImg;
        backimg.onload = () => {
            backctx.drawImage(backimg,0,0,600,500);
        };
    }

    const handleUpload = () => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob((blob) => 
            uploadImage(blob),
            "image/png",
            0.95
        );
    };

    const uploadImage = async (blob) => {
        if (!blob) return;

        const config = {
            header: {
                "content-type": "multipart/form-data",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };

        const formData = new FormData();
        formData.append('file', blob);
        formData.append('filename', 'test.png');

        await axios.post('http://localhost:8000/files/', formData, config)
                .then((res)=>{
                    console.log(87, res);
                    setContours(res.data.con);
                    setResImg(res.data.filename);
                })
                .catch((err)=>{
                    console.log(81, err);
                });
        };

    useEffect(() => {
        // 그림판 캔버스
        const canvas = canvasRef.current;
        canvas.width = 600;
        canvas.height = 500;

        const context = canvas.getContext("2d");
        context.lineWidth = 20; // 펜 굵기
        context.lineCap = 'round'; // 펜 모양
        context.strokeStyle = 'white'; // 윤곽선 색
        contextRef.current=context;
        setCtx(contextRef.current);

        // 배경 이미지 캔버스
        const backcanvas = backcanvasRef.current;
        backcanvas.width = 600;
        backcanvas.height = 500;
        const backcontext = backcanvas.getContext("2d");
        backcontextRef.current = backcontext;
        setBackCtx(backcontextRef.current);
    },[]);

    resImg == null ? img.src = sampleImg: 
        img.src = 'img/'+resImg;
        console.log('img/'+resImg
    );
    
    img.onload = () => {
        if(backctx !== undefined){
            backctx.drawImage(img,0,0,600,500);
        };
    };

    backimg.onload = () => {
        if(ctx !== undefined){
            ctx.drawImage(backimg,0,0,600,500);
        };
    }

    return(
        <>
            <div >
                <div className='canvas' style={{position: "relative"}}>
                    <canvas
                        id = "canvasTop"
                        ref= {backcanvasRef}
                    ></canvas> 
                </div>
                <div style={{position: "relative",top: -500}}>
                    <canvas
                        id ="canvasBottom" 
                        ref={canvasRef}
                        onMouseDown = {downHandler}
                        onMouseUp = {upHandler}
                        onMouseMove = {moveHandler}
                    ></canvas>
                </div>
                 <div className="control" style={{position: "relative",top: -500}}>
                    <button className="color-btn" data-type="color" data-color="white" onClick={e=>{setColor(e)}}></button>
                    <button className="color-btn" data-type="color" data-color="red" onClick={e=>{setColor(e)}}></button>
                    <button className="color-btn" data-type="color" data-color="green" onClick={e=>{setColor(e)}}></button>
                    <button className="color-btn" data-type="color" data-color="blue" onClick={e=>{setColor(e)}}></button>
                </div>
                <div style={{position: "relative",top: -500}}>
                    <button className="clear-btn" onClick={e=>{clearCanvas(e)}}>화면 비우기</button>
                    <button onClick={e=>{hideImage(e)}}>이미지 숨기기</button>
                    <button onClick={handleUpload}>좌표추출</button>
                    <p>좌표 : { contours } </p>
                </div>
            </div>
           
            
        </>
    );
};
