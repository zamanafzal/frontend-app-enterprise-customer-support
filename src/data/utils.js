import moment from "moment";

export const humanizeTime = time => {
    let finalTime = null;
    if (
        /(minutes?|hours?)/i.test(
            moment(time)
                .fromNow()
                .split(" ")[1]
        ) ||
        /seconds?/i.test(
            moment(time)
                .fromNow()
                .split(" ")[2]
        )
    ) {
        finalTime = moment(time).fromNow();
    } else {
        finalTime = moment(time).format("DD MMM  YYYY [at] h:mm a");
    }
    return finalTime;
};

export const jsonConvert = val => {
    return JSON.stringify(val);
};