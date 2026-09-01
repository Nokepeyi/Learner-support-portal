START

DISPLAY "Support Booking System"

INPUT learner name
INPUT learner ID
INPUT support type
INPUT preferred date
INPUT preferred time

IF learner name is empty OR learner ID is empty THEN
    DISPLAY "Please enter all required learner details"
ELSE

    IF support type is empty THEN
        DISPLAY "Please select a support type"
    ELSE

        CHECK available support slots

        IF slot is available THEN
            CREATE support booking
            SAVE learner details
            SAVE support type
            SAVE date
            SAVE time
            SET booking status = "Confirmed"

            DISPLAY "Support booking confirmed"
            DISPLAY booking details

        ELSE
            DISPLAY "The selected slot is unavailable"
            DISPLAY "Please choose another date or time"

            INPUT new date
            INPUT new time

            CHECK available support slots

            IF new slot is available THEN
                CREATE support booking
                SAVE booking details
                SET booking status = "Confirmed"

                DISPLAY "Support booking confirmed"
            ELSE
                DISPLAY "No available slot"
            ENDIF
        ENDIF

    ENDIF

ENDIF

DISPLAY "Thank you for using the Support Booking System"

END

