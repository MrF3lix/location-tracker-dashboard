import React from 'react'
import classnames from 'classnames'

export const LocationPin = ({ size = 30, isLive = true, direction = 0, isDisabled, ...rest }) => {
    return (
        <svg className={classnames('pin pin--track', { 'gray': isDisabled })} width={size} height={size} {...rest} viewBox="0 0 328 328" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'translate(-50%, -50%)'}}>
            <circle id={isLive ? 'tracking-pin__animation' : ''} cx="164" cy="164" r="164" fill="#3E38F2" fillOpacity="0.2" />
            <circle cx="164" cy="164" r="100" fill="white" />
            <circle cx="162.5" cy="162.5" r="87.5" fill="#230A59" />
            <g style={{ transform: `rotate(${direction - 45}deg) scale(.8)`, transition: 'all .2s linear', transformOrigin: 'center center' }}>
                <path d="M212.463 119.737L166.106 212.464C165.285 214.155 163.909 215 161.977 215C161.736 215 161.374 214.952 160.891 214.855C159.829 214.614 158.972 214.07 158.32 213.225C157.668 212.38 157.342 211.426 157.342 210.364V168.636H115.62C114.558 168.636 113.604 168.31 112.759 167.658C111.914 167.006 111.371 166.149 111.129 165.087C110.888 164.024 110.984 163.01 111.419 162.044C111.854 161.078 112.554 160.354 113.52 159.871L206.234 113.507C206.862 113.169 207.562 113 208.335 113C209.639 113 210.725 113.459 211.594 114.376C212.319 115.053 212.765 115.886 212.934 116.876C213.103 117.866 212.946 118.82 212.463 119.737Z" fill="white" />
            </g>
        </svg>
    );
};