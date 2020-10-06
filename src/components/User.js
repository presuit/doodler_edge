import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";

const User = () => {
    const [user, setUser] = useState(authService.currentUser);
    const [highestScore, setHighestScore] = useState(0);
    let myScores = [];
    const findMyBestScore = (arr) => {
        for (const item of arr) {
            if (item.userId === user.uid) {
                myScores.push(item);
            }
        }
        myScores.sort((a, b) => b.score - a.score);
        setHighestScore(myScores[0].score);
    };
    useEffect(() => {
        dbService.collection("scores").onSnapshot((snapshot) => {
            const scoresItems = snapshot.docs.map((doc) => ({ ...doc.data() }));
            findMyBestScore(scoresItems);
        });
    }, []);
    return (
        <>
            <div>
                <h3>{user.displayName}</h3>
                <h3>{user.email}</h3>
                <h3>나의 최고 점수: {highestScore} </h3>
            </div>
        </>
    );
};

export default User;
