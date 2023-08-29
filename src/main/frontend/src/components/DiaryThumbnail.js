import React, { useEffect, useState } from "react";
import axios from "axios";

const DiaryThumbnail = ({ selectedDate }) => {
    const [entryDataList, setEntryDataList] = useState([]);

    useEffect(() => {
        // Fetch diary entry data for the selected date
        fetchDiaryEntries(selectedDate);
    }, [selectedDate]);

    const fetchDiaryEntries = async (selectedDate) => {
        try {
            const selectedDateUTC = new Date(
                Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
            );
            const formattedDate = selectedDateUTC.toISOString().split("T")[0];
            const response = await axios.get(`/api/diary/entry`, {
                params: {
                    date: formattedDate
                }
            });

            if (response.data && response.data.length > 0) {
                setEntryDataList(response.data);
            } else {
                setEntryDataList([]);
            }
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div>

            <div>
                {entryDataList.length > 0 ? (
                    <div>
                        {entryDataList.map(entryData => (
                            <div key={entryData.id}>
                                <p>Entry Date: {entryData.date.split("T")[0]}</p> {/* Print entry date */}
                                <img
                                    src={`/api/diary/images?thumbnailpath=${encodeURIComponent(entryData.thumbnailpath)}`}
                                    alt="Thumbnail"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No diary entries found for the selected date.</p>
                )}
            </div>
        </div>
    );
};

export default DiaryThumbnail;