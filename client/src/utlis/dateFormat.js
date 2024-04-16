const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
];

const getMetaData = (date) => {
    const now = new Date();
    const diffs = Math.floor(Math.abs(now - date) / 1000);

    if (diffs < 60) {
        return diffs + " seconds ago";
    } else if (diffs < 60 * 60) {
        return Math.floor(diffs / 60) + " minutes ago";
    } else if (diffs < 60 * 60 * 24) {
        let h = Math.floor(diffs / 3600);
        return h + " hours ago";
    } else if (diffs < 60 * 60 * 24 * 365) {
        return (
            months[date.getMonth()] +
            " " +
            getDateHelper(date) +
            " at " +
            date.toTimeString().slice(0, 8)
        );
    } else {
        return (
            months[date.getMonth()] +
            " " +
            getDateHelper(date) +
            ", " +
            date.getFullYear() +
            " at " +
            date.toTimeString().slice(0, 8)
        );
    }
};

const getDateHelper = (date) => {
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return day;
};

export { getMetaData };