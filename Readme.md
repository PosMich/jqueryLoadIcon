# Simple jQuery Loadicon

## Usage
1. create canvas 
>    <canvas class="loadicon" width="17" height="17"></canvas>
2. bind plugin $(".loadicon").loadicon();
>   or with options:
>    size           0.85 ( size of big circle (rotation path) in %)
>    amount         10
>    circleSize     0.5  ( size of each small circle in %)
>    fillColor      #ff0
>    strokeColor    #ffa200
>    tail           0.75 ( % )
>    speed          75
>    shadowColor    #000
>    shadowOffsetX  0
>    shadowOffsetY  0
>    shadowBlur     3
3. start
>   $(".loadicon").loadicon("start");
4. stop
>   $(".loadicon").loadicon("stop");
