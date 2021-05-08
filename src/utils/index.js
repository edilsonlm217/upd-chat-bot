const charset = {
  'á': "eaacute;",
  'à': "eagrave;",
  'ã': "eatilde;",
  'â': "eacirc;",
  'ä': "eauml;",

  'Á': "eaacute;",
  'À': "eagrave;",
  'Ã': "eatilde;",
  'Â': "eacirc;",
  'Ä': "eauml;",

  'é': "eeacute;",
  'è': "eegrave;",
  'ê': "eecirc;",
  'ë': "eeuml;",

  'É': "eEacute;",
  'È': "eEgrave;",
  'Ê': "eEcirc;",
  'Ë': "eEuml;",

  'é': "eeacute;",
  'è': "eegrave;",
  'ê': "eecirc;",
  'ë': "eeuml;",

  'É': "eEacute;",
  'È': "eEgrave;",
  'Ê': "eEcirc;",
  'Ë': "eEuml;",

  'í': "eiacute;",
  'ì': "eigrave;",
  'î': "eicirc;",
  'ï': "eiuml;",

  'Í': "eIacute;",
  'Ì': "eIgrave;",
  'Î': "eIcirc;",
  'Ï': "eIuml;",

  'ó': "eoacute;",
  'ò': "eograve;",
  'õ': "eotilde;",
  'ô': "eocirc;",
  'ö': "eouml;",

  'Ó': "eOacute;",
  'Ò': "eOgrave;",
  'Õ': "eOtilde;",
  'Ô': "eOcirc;",
  'Ö': "eOuml;",

  'ú': "euacute;",
  'ù': "eugrave;",
  'û': "eucirc;",
  'ü': "euuml;",

  'Ú': "eUacute;",
  'Ù': "eUgrave;",
  'Û': "eUcirc;",
  'Ü': "eUuml;",

  'ñ': "entilde;",
  'Ñ': "eNtilde;",

  'ç': "eccedil;",
  'Ç': "eCcedil;",
};

function fixAccentuation(msg, key, value) {
  var string = msg
  if (msg.includes(value)) {
    string = msg.replace(value, key);
    return string;
  }

  return string;
}

exports.fixAccentuation = fixAccentuation;
exports.charset = charset;