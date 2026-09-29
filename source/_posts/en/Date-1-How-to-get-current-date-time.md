---
title: '[Date] 1 How to get current date time'
catalog: true
lang: en
date: 2021-07-13 18:56:07
subtitle: The main API for dates, times, instants, and durations.
header-img: /img/header_img/categories_bg5.jpg
tags:
- Date
---

In this tutorial, we will show you how to get the current date time from the new Java 8 java.time.* like [Localdate](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/LocalDate.html), [LocalTime](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/LocalTime.html), [LocalDateTime](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/LocalDateTime.html), [ZonedDateTime](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/ZonedDateTime.html), [Instant](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/Instant.html) and also the legacy date time APIs like [Date](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Date.html) and [Calendar](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Calendar.html).

## Summary
- For new Java 8 `java.time.*` APIs , we can use `.now()` to get the current date-time and format it with [DateTimeFormatter](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/format/DateTimeFormatter.html).
- For legacy date-time APIs, we can use `new Date()` and `Calendar.getInstance()` to get the current date-time and format it with [SimpleDateFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/SimpleDateFormat.html).


## Get current date time in Java
The below are some code snippets to display the current date-time in Java. 

For `java.time.LocalDate`, uses `LocalDate.now()`.
```java
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd");
LocalDate localDate = LocalDate.now();
System.out.println(dtf.format(localDate));            // 2021/03/22
```

For `java.time.localTime`, uses `LocalTime.now()`.
```java
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm:ss");
LocalTime localTime = LocalTime.now();
System.out.println(dtf.format(localTime));            // 16:37:15
```

For `java.time.LocalDateTime`, uses `LocalDateTime.now()`.
```java
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd HH:mm:ss");
LocalDateTime now = LocalDateTime.now();
System.out.println(dtf.format(now));                  //  2021/03/22 16:37:15
```

For `java.time.ZonedDateTime`, uses `ZonedDateTime.now()`.
```java
// get current date-time, with system default time zone
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd HH:mm:ss");
ZonedDateTime now = ZonedDateTime.now();
System.out.println(dtf.format(now));                  // 2021/03/22 16:37:15
System.out.println(now.getOffset());                  // +08:00

// get current date-time, with a specified time zone
ZonedDateTime japanDateTime = now.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
System.out.println(dtf.format(japanDateTime));        // 2021/03/22 17:37:15
System.out.println(japanDateTime.getOffset());        // +09:00
```

For `java.time.Instant`, uses `Instant.now()`.
```java
Instant now = Instant.now();

// convert Instant to ZonedDateTime
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd HH:mm:ss");
ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(now, ZoneId.systemDefault());
System.out.println(dtfDateTime.format(zonedDateTime));
```

For `java.util.Date`, uses `new Date()`.
```java
DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
Date date = new Date();
System.out.println(dateFormat.format(date));           // 2021/03/22 16:37:15
```

For `java.util.Calendar`, uses `Calendar.getInstance()`.
```java
DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
Calendar cal = Calendar.getInstance();
System.out.println(dateFormat.format(cal.getTime()));  // 2021/03/22 16:37:15
```

## java.time.LocalDate
For the `java.time.LocalDate`, uses `LocalDate.now()` to get the current date without a time-zone, and format it with the `DateTimeFormatter`.

*Example:* LocalDate
```java
package com.mkyong.app;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LocalDateExample {
  public static void main(String[] args) {
      DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd");
      LocalDate localDate = LocalDate.now();
      System.out.println(dtf.format(localDate));    // 2021/03/22
  }
}
```

## java.time.LocalTime
For the `java.time.LocalTime`, uses `LocalDate.now()` to get the current time without a time-zone, and format it with the `DateTimeFormatter`.

*Example:* LocalTime
```java
package com.mkyong.app;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class LocalTimeExample {
    public static void main(String[] args) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime localTime = LocalTime.now();
        System.out.println(dtf.format(localTime));    // 16:37:15
    }
}
```

## java.time.LocalDateTime
For `java.time.LocalDateTime`, uses `LocalDateTime.now()` to get the current date time without a time-zone, and format it with the `DateTimeFormatter`.

**Example:** LocalDateTime
```java
package com.mkyong.app;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeExample {
    public static void main(String[] args) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        System.out.println(dtf.format(now));        //  2021/03/22 16:37:15
    }
}
```

## java.time.ZonedDateTime
For `java.time.ZonedDateTime`, uses `ZonedDateTime.now()` to get the current date time with the system default time zone, or a specified time zone.

**Example:** ZonedDateTime
```java
package com.mkyong.app;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class ZonedDateTimeExample {
  public static void main(String[] args) {
      DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd HH:mm:ss");

      // Get default time zone
      System.out.println(ZoneOffset.systemDefault());         // Asia/Kuala_Lumpur
      System.out.println(OffsetDateTime.now().getOffset());   // +08:00

      // get current date time, with +08:00
      ZonedDateTime now = ZonedDateTime.now();
      System.out.println(dtf.format(now));                    // 2021/03/22 16:37:15
      System.out.println(now.getOffset());                    // +08:00

      // get get current date time, with +09:00
      ZonedDateTime japanDateTime = now.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
      System.out.println(dtf.format(japanDateTime));          // 2021/03/22 17:37:15
      System.out.println(japanDateTime.getOffset());          // +09:00
  }
}
```

##  java.time.Instant
For `java.time.Instant`, uses `Instant.now()` to get the seconds passed since the [Unix epoch time](https://en.wikipedia.org/wiki/Unix_time) (midnight of January 1, 1970 UTC), and later convert to other `java.time.*` date time classes like `LocalDate`, `LocalDateTime` and `ZonedDateTime`.

**Example:** Instant
```java
package com.mkyong.app;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class InstantExample {
  private static final DateTimeFormatter dtfDate = DateTimeFormatter.ofPattern("uuuu/MM/dd");
  private static final DateTimeFormatter dtfTime = DateTimeFormatter.ofPattern("HH:mm:ss");
  private static final DateTimeFormatter dtfDateTime = DateTimeFormatter.ofPattern("uuuu/MM/dd HH:mm:ss");
  public static void main(String[] args) {
      // seconds passed since the Unix epoch time (midnight of January 1, 1970 UTC)
      Instant now = Instant.now();

      // convert Instant to LocalDate
      LocalDate localDate = LocalDate.ofInstant(now, ZoneId.systemDefault());
      System.out.println(dtfDate.format(localDate));            // 2021/03/22

      // convert Instant to localTime
      LocalTime localTime = LocalTime.ofInstant(now, ZoneId.systemDefault());
      System.out.println(dtfTime.format(localTime));            // 16:37:15

      // convert Instant to LocalDateTime
      LocalDateTime localDateTime = LocalDateTime.ofInstant(now, ZoneId.systemDefault());
      System.out.println(dtfDateTime.format(localDateTime));    // 2021/03/22 16:37:15

      // convert Instant to ZonedDateTime
      ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(now, ZoneId.systemDefault());
      System.out.println(dtfDateTime.format(zonedDateTime));    // 2021/03/22 16:37:15
  }
}
```

## java.util.Date (Legacy)
For the legacy `java.util.Date`, uses `new Date()` or `new Date(System.currentTimeMillis()` to get the current date time, and format it with the `SimpleDateFormat`.

*Example:* Date
```java
package com.mkyong.app;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateExample {
  public static void main(String[] args) {
      DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

      Date date = new Date();
      System.out.println(dateFormat.format(date));    // 2021/03/22 16:37:15

      // new Date() actually calls this new Date(long date)
      Date date2 = new Date(System.currentTimeMillis());
      System.out.println(dateFormat.format(date));    // 2021/03/22 16:37:15
  }
}
```

## java.util.Calendar (Legacy)
For the legacy `java.util.Calendar`, uses `Calendar.getInstance()` to get the current date time, and format it with the `SimpleDateFormat`.

*Example:* Calendar
```java
package com.mkyong.app;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class CalendarExample {
  public static void main(String[] args) {
      DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
      Calendar cal = Calendar.getInstance();
      System.out.println(dateFormat.format(cal.getTime()));   // 2021/03/22 16:37:15
  }
}
```

References：https://mkyong.com/java/java-how-to-get-current-date-time-date-and-calender/