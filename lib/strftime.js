// Written by Gianni Chiappetta - gianni[at]runlevel6[dot]org
// Released under the WTFPL

if ( typeof Date.prototype.strftime == 'undefined' ) {
  /**
   * Date#strftime(format) -> String
   * - format (String): Formats time according to the directives in the given format string. Any text not listed as a directive will be passed through to the output string.
   * 
   * Ruby-style date formatting. Format matchers:
   *
   * %a - The abbreviated weekday name (``Sun'')
   * %A - The  full  weekday  name (``Sunday'')
   * %b - The abbreviated month name (``Jan'')
   * %B - The  full  month  name (``January'')
   * %c - The preferred local date and time representation
   * %d - Day of the month (01..31)
   * %e - Day of the month without leading zeroes (1..31)
   * %H - Hour of the day, 24-hour clock (00..23)
   * %I - Hour of the day, 12-hour clock (01..12)
   * %j - Day of the year (001..366)
   * %k - Hour of the day, 24-hour clock w/o leading zeroes (0..23)
   * %l - Hour of the day, 12-hour clock w/o leading zeroes (1..12)
   * %m - Month of the year (01..12)
   * %M - Minute of the hour (00..59)
   * %p - Meridian indicator (``AM''  or  ``PM'')
   * %P - Meridian indicator (``am''  or  ``pm'')
   * %S - Second of the minute (00..60)
   * %U - Week  number  of the current year,
   *      starting with the first Sunday as the first
   *      day of the first week (00..53)
   * %W - Week  number  of the current year,
   *      starting with the first Monday as the first
   *      day of the first week (00..53)
   * %w - Day of the week (Sunday is 0, 0..6)
   * %x - Preferred representation for the date alone, no time
   * %X - Preferred representation for the time alone, no date
   * %y - Year without a century (00..99)
   * %Y - Year with century
   * %Z - Time zone name
   * %z - Time zone expressed as a UTC offset (``-04:00'')
   * %% - Literal ``%'' character
   *
   * http://www.ruby-doc.org/core/classes/Time.html#M000298
   *
   **/
  
  Object.defineProperty( Date.prototype, 'strftime',
    { value: (function(){
      var cache = { start_of_year: new Date( 'Jan 1 ' + new Date()).getFullYear() }
        , regexp = /%([a-z]|%)/mig
        , day_in_ms = 1000 * 60 * 60 * 24
        , days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
        , months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
        , abbr_days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
        , abbr_months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
        , formats =
            { 'a': weekday_name_abbr
            , 'A': weekday_name
            , 'b': month_name_abbr
            , 'B': month_name
            , 'c': default_local
            , 'd': day_padded
            , 'e': day
            , 'H': hour_24_padded
            , 'I': hour_padded
            , 'j': day_of_year
            , 'k': hour_24
            , 'l': hour
            , 'm': month
            , 'M': minute
            , 'p': meridian_upcase
            , 'P': meridian
            , 'S': second
            , 'U': week_number_from_sunday
            // , 'W': week_number_from_monday
            , 'w': day_of_week
            , 'x': default_local_date
            , 'X': default_local_time
            , 'y': year_abbr
            , 'Y': year
            // , 'Z': time_zone_name
            , 'z': time_zone_offset
            , '%': function() { return '%' }
            }

      // Strftime
      return strftime
      
      /* ------------------------------ Utility Functions ------------------------------ */
      // day
      function day( date ) {
        return date.getDate() + ''
      }
      
      // day_of_week
      function day_of_week( date ) {
        return date.getDay() + ''
      }
      
      // day_of_year
      function day_of_year( date ) {
        return ( ( ( date.getTime() - cache[ 'start_of_year' ].getTime() ) / day_in_ms + 1 ) + '' ).split( /\./ )[0]
      }
      
      // day_padded
      function day_padded( date ) {
        return ( '0' + day( date ) ).slice(-2)
      }
      
      // default_local
      function default_local( date ) {
        return date.toLocaleString()
      }
      
      // default_local_date
      function default_local_date( date ) {
        return date.toLocaleDateString()
      }
      
      // default_local_time
      function default_local_time( date ) {
        return date.toLocaleTimeString()
      }
      
      // hour
      function hour( date ) {
        var hour = date.getHours()
        
        if ( hour === 0 )
          hour = 12
        else if ( hour > 12 )
          hour -= 12
        
        return hour + ''
      }
      
      // hour_24
      function hour_24( date ) {
        return date.getHours()
      }
      
      // hour_24_padded
      function hour_24_padded( date ) {
        return ( '0' + hour_24( date ) ).slice(-2)
      }
      
      // hour_padded
      function hour_padded( date ) {
        return ( '0' + hour( date ) ).slice(-2)
      }
      
      // meridian
      function meridian( date ) {
        return date.getHours() >= 12 ? 'pm' : 'am'
      }
      
      // meridian_upcase
      function meridian_upcase( date ) {
        return meridian( date ).toUpperCase()
      }
      
      // minute
      function minute( date ) {
        return ( '0' + date.getMinutes() ).slice(-2)
      }
      
      // month
      function month( date ) {
        return ( '0' + ( date.getMonth() + 1 ) ).slice(-2)
      }
      
      // month_name
      function month_name( date ) {
        return months[ date.getMonth() ]
      }
      
      // month_name_abbr
      function month_name_abbr( date ) {
        return abbr_months[ date.getMonth() ]
      }
      
      // second
      function second( date ) {
        return ( '0' + date.getSeconds() ).slice(-2)
      }
      
      // time_zone_offset
      function time_zone_offset( date ) {
        var tz_offset = date.getTimezoneOffset()
        return ( tz_offset >= 0 ? '-' : '' ) + ( '0' + ( tz_offset / 60 ) ).slice(-2) + ':' + ( '0' + ( tz_offset % 60 ) ).slice(-2)
      }
      
      // week_number_from_sunday
      function week_number_from_sunday( date ) {
        return ( '0' + Math.round( parseInt( day_of_year( date ), 10 ) / 7 ) ).slice(-2)
      }
      
      // weekday_name
      function weekday_name( date ) {
        return days[ date.getDay() ]
      }
      
      // weekday_name_abbr
      function weekday_name_abbr( date ) {
        return abbr_days[ date.getDay() ]
      }
      
      // year
      function year( date ) {
        return date.getFullYear() + ''
      }
      
      // year_abbr
      function year_abbr( date ) {
        return year( date ).slice(-2)
      }
      
      /*------------------------------ Main ------------------------------*/
      function strftime( format ) {
        var match
          , output = format
        cache[ 'start_of_year' ] = new Date( 'Jan 1 ' + this.getFullYear() )
        
        while ( match = regexp.exec( format ) )
          if ( match[1] in formats )
            output = output.replace( new RegExp( match[0], 'mg' ), formats[ match[1] ](this) )
        
        return output
      }
    })()
  })
}

