<?php


    header('Content-Type: application/json;charset=utf-8');

echo '{
  "response_code": 200,
  "debit": 1,
  "trains": [
    {
      "name": "ADI -HOWRAH EXPRESS",
      "number": "12833",
      "rescheduled_time": "03:15",
      "rescheduled_date": "03-7-2017",
      "time_diff": "03:00",
      "from_station": {
        "code": "ADI",
        "name": "AHMEDABAD JN"
      },
      "to_station": {
        "code": "HWH",
        "name": "HOWRAH JN"
      }
    }
  ]
}';