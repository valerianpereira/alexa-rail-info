<?php


    header('Content-Type: application/json;charset=utf-8');

echo '{
  "response_code": 200,
  "debit": 1,
  "trains": [
    {
      "name": "ANVT-UHP EXPRESS SPL",
      "number": "04401",
      "type": "HSP",
      "start_time": "22:20",
      "source": {
        "name": "ANAND VIHAR TERMINAL",
        "code": "ANVT"
      },
      "dest": {
        "name": "SH MATA V DEVI KATRA",
        "code": "SVDK"
      }
    },
    {
      "name": "LTT - HW SUPER FAST EXP",
      "number": "12171",
      "type": "SUF",
      "start_time": "07:55",
      "source": {
        "name": "LOKMANYATILAK",
        "code": "LTT"
      },
      "dest": {
        "name": "HARIDWAR JN",
        "code": "HW"
      }
    }
  ]
}';