export const blueButton = {
    style: {
        backgroundColor: '#1664FF',
        color: 'white',
        marginRight: '10px',
        transition: 'opacity 0.3s', // 添加过渡效果
        opacity: 1, // 初始透明度
    },
    onMouseEnter: (e: { currentTarget: { style: { opacity: number; }; }; }) => {
        e.currentTarget.style.opacity = 0.7; // 鼠标进入时将透明度设置为0.7
    },
    onMouseLeave: (e: { currentTarget: { style: { opacity: number; }; }; }) => {
        e.currentTarget.style.opacity = 1; // 鼠标离开时恢复透明度
    },
};
export const cancelButton = {
    style: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
};