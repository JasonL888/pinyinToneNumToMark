/*
 * pinyinToneNumToMark
 *
 * Maps pinyin tone numbers, eg. han4 to the unicode version of hàn
 * Original code from http://stackoverflow.com/questions/1598856/convert-numbered-to-accentuated-pinyin/17127315#17127315
 * - by http://stackoverflow.com/users/1948449/flexy
 * 
 * @author Jason Lau
 */

/* 
 * Lookup table to quickly reference the appropriate unicode for each tone number
 */
var ToneMapArray = {
	'1': {'a': '\u0101', 'e': '\u0113', 'i': '\u012B', 'o': '\u014D', 'u': '\u016B', 'ü': '\u01D6'},
	'2': {'a': '\u00E1', 'e': '\u00E9', 'i': '\u00ED', 'o': '\u00F3', 'u': '\u00FA', 'ü': '\u01D8'},
	'3': {'a': '\u01CE', 'e': '\u011B', 'i': '\u01D0', 'o': '\u01D2', 'u': '\u01D4', 'ü': '\u01DA'},
	'4': {'a': '\u00E0', 'e': '\u00E8', 'i': '\u00EC', 'o': '\u00F2', 'u': '\u00F9', 'ü': '\u01DC'}
};

function getPos (token) {
	if (token.length <= 2){
	    // only one letter, nothing to differentiate
	    return 0;
	}
	var precedence = ['a', 'e', 'o'];
	for (i=0; i<precedence.length; i += 1){
	    var pos = token.indexOf(precedence[i]);
	    // checking a before o, will take care of ao automatically
	    if (pos >= 0){
	        return pos;
	    }
	}
	var u = token.indexOf('u');
	var i = token.indexOf('i');
	if ( i>=0 && u>=0 )
	{
		if (i < u){
		    // -iu OR u-only case, accent goes to u
		    return u;
		} else {
		    // -ui OR i-only case, accent goes to i
		    return i;
		}
	}	
 	if ( i>= 0 )
 	{
 		// -i without u
 		return i;
 	}
 	if ( u>= 0 )
 	{
 		// -u withou i
 		return u;
 	}
	var ü = token.indexOf('ü');
	if (ü >= 0){
	    return ü;
	}
	return 0;
}

/* 
 * Place unicode pinyin tone mark on a single pinyin tone number word
 *
 * @param single pinyin tone word, eg "han4"
 * @return single word with unicode pinyin tone mark
 */
function placeTonePerWord(orig_toneNumberPinYin){
	var toneNumberPinYin = orig_toneNumberPinYin.replace(/u:/g, "ü");
	var toneIndex = toneNumberPinYin.charAt(toneNumberPinYin.length -1);
	if (isNaN(toneIndex) == true)
	{
		console.log('toneIndex not a number:' + toneIndex);
		return(orig_toneNumberPinYin);
	}
	var tonePos = getPos(toneNumberPinYin);
	var toneChar;
	if ( toneIndex >= 1 && toneIndex <= 4 )
	{
		toneChar = ToneMapArray[toneIndex][toneNumberPinYin.charAt(tonePos)];
	}
	else
	{
		toneChar = toneNumberPinYin[tonePos];
	}
	
	var toneMarkedPinYin = "";
	if (tonePos === 0){
	    // minus one to trimm the number off
	    toneMarkedPinYin = toneChar + toneNumberPinYin.substr(1, toneNumberPinYin.length-1); 
	} else {
	      var before = toneNumberPinYin.substr(0, tonePos);
	      var after = toneNumberPinYin.substring(tonePos+1, toneNumberPinYin.length-1);
	      toneMarkedPinYin = before + toneChar + after;
	}
	return toneMarkedPinYin;
}

/* 
 * Place unicode pinyin tone mark over all the pinyin tone number words
 *
 * Parsing through space delimited string and individually put unicode pinyin tone mark for each word
 * Note: words without any tone mark will be returned as is
 *
 * @param space delimited string with pinyin tone numbers eg. han4 zi4
 * @return string with the pinyin tone numbers (if any) replaced by unicode pinyin tone marks - otherwise no change to input word
 */ 
function pinyinToneNumToMark( str )
{
	var strArray = str.split(" ");
	var retStr = "";
	for( var i=0; i<strArray.length; i++)
	{
		retStr = retStr + placeTonePerWord(strArray[i]);
		if ( i<(strArray.length - 1) )
		{
			retStr = retStr + " ";
		}
	}
	return( retStr );
}

module.exports.pinyinToneNumToMark = pinyinToneNumToMark;
