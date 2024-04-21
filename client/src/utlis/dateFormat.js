const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];

const getMetaData = (date) => {
    const now = new Date();
    const secondsDiff = Math.floor((now - date) / 1000);

    if (secondsDiff < 60) {
        return `${secondsDiff} seconds ago`;
    } else if (secondsDiff < 3600) { // 60 * 60
        return `${Math.floor(secondsDiff / 60)} minutes ago`;
    } else if (secondsDiff < 86400) { // 60 * 60 * 24
        return `${Math.floor(secondsDiff / 3600)} hours ago`;
    } else if (secondsDiff < 31536000) { // 60 * 60 * 24 * 365
        return `${months[date.getMonth()]} ${formatDay(date)} at ${formatTime(date)}`;
    } else {
        return `${months[date.getMonth()]} ${formatDay(date)}, ${date.getFullYear()} at ${formatTime(date)}`;
    }
};

const formatDay = (date) => {
    const day = date.getDate();
    return day < 10 ? `0${day}` : day;
};

const formatTime = (date) => {
    return date.toTimeString().slice(0, 8);
};

export { getMetaData };
