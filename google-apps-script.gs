/**
 * GOOGLE APPS SCRIPT - API REAL-TIME UNTUK APLIKASI AKUNTANSI
 * 
 * PETUNJUK PEMASANGAN:
 * 1. Buka Google Sheets Anda.
 * 2. Klik menu Extensions > Apps Script.
 * 3. Hapus semua kode lama, dan tempelkan seluruh kode di bawah ini.
 * 4. Ganti 'YOUR_APP_URL' dengan URL aplikasi Anda (misalnya: https://ais-dev-...)
 * 5. Klik tombol "Deploy" (kanan atas) > "New Deployment".
 * 6. Pilih type: "Web App".
 * 7. Description: "API Realtime".
 * 8. Execute as: "Me" (Email Anda).
 * 9. Who has access: "Anyone" (PENTING agar aplikasi bisa memanggilnya).
 * 10. Klik "Deploy".
 * 11. Salin URL Web App yang muncul (berakhiran /exec) dan tempelkan di menu Sinkronisasi aplikasi.
 */

// GANTI DENGAN URL APLIKASI ANDA
var APP_URL = "https://ais-dev-kskt52ompe5yavapwbdggd-281371416929.asia-southeast1.run.app";

/**
 * Menambahkan menu ke Google Sheets saat dibuka
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Sinkronisasi App')
      .addItem('Sinkronkan Sheet Ini', 'syncCurrentSheet')
      .addItem('Sinkronkan Semua Sheet', 'syncAllSheets')
      .addSeparator()
      .addItem('Pengaturan URL', 'showSettings')
      .addToUi();
}

/**
 * Menangani permintaan GET dari aplikasi
 */
function doGet(e) {
  try {
    var sheetName = e.parameter.sheet;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (!sheetName) {
      var sheets = ss.getSheets().map(function(s) { return s.getName(); });
      return createJsonResponse({ 
        success: true, 
        message: "API Aktif. Gunakan parameter ?sheet=NamaSheet untuk mengambil data.",
        available_sheets: sheets 
      });
    }
    
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return createJsonResponse({ 
        success: false, 
        error: "Sheet '" + sheetName + "' tidak ditemukan di Spreadsheet ini." 
      });
    }
    
    var data = sheet.getDataRange().getValues();
    var type = detectDataType(sheetName, data);
    
    return createJsonResponse({ 
      success: true,
      type: type,
      sheet: sheetName,
      data: data 
    });
    
  } catch (error) {
    return createJsonResponse({ 
      success: false, 
      error: "Terjadi kesalahan pada Script: " + error.toString() 
    });
  }
}

/**
 * Mendeteksi tipe data berdasarkan nama sheet dan struktur kolom
 */
function detectDataType(sheetName, data) {
  var name = sheetName.toLowerCase();
  
  // Deteksi berdasarkan nama (RKAPB, Anggaran, Budget, atau tahun 4 digit)
  if (name.indexOf('rkapb') > -1 || name.indexOf('anggaran') > -1 || name.indexOf('budget') > -1 || (name.length === 4 && !isNaN(name))) {
    return "budget";
  }
  
  // Deteksi berdasarkan struktur kolom
  if (data && data.length > 0) {
    for (var i = 0; i < Math.min(20, data.length); i++) {
      var row = data[i];
      if (!row || row.length < 5) continue;
      
      var rowStr = row.join("|").toLowerCase();
      // Jika ada Januari dan Februari dalam satu baris, kemungkinan besar Budget/RKAPB
      if (rowStr.indexOf('januari') > -1 && rowStr.indexOf('februari') > -1) {
        return "budget";
      }
      if (rowStr.indexOf('jan') > -1 && rowStr.indexOf('feb') > -1 && rowStr.indexOf('mar') > -1) {
        return "budget";
      }
    }
  }
  
  return "trial_balance";
}

/**
 * Sinkronisasi sheet yang sedang aktif ke aplikasi
 */
function syncCurrentSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var sheetName = sheet.getName();
  var data = sheet.getDataRange().getValues();
  var type = detectDataType(sheetName, data);
  
  var payload = {
    type: type,
    data: data
  };
  
  // Jika trial balance, coba ambil period dari nama sheet (misal: "Januari 2026")
  if (type === "trial_balance") {
    payload.period = extractPeriod(sheetName);
  } else {
    payload.year = extractYear(sheetName);
  }
  
  sendToApp(payload, sheetName);
}

/**
 * Sinkronisasi semua sheet yang relevan ke aplikasi
 */
function syncAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var results = [];
  
  sheets.forEach(function(sheet) {
    var sheetName = sheet.getName();
    var data = sheet.getDataRange().getValues();
    var type = detectDataType(sheetName, data);
    
    // Hanya sinkronkan sheet yang terlihat seperti data akuntansi
    if (type === "budget" || /Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember/i.test(sheetName)) {
      var payload = {
        type: type,
        data: data
      };
      
      if (type === "trial_balance") {
        payload.period = extractPeriod(sheetName);
      } else {
        payload.year = extractYear(sheetName);
      }
      
      var res = sendToApp(payload, sheetName, true);
      results.push(sheetName + ": " + (res ? "Sukses" : "Gagal"));
    }
  });
  
  SpreadsheetApp.getUi().alert("Hasil Sinkronisasi:\n" + results.join("\n"));
}

/**
 * Mengirim data ke API aplikasi
 */
function sendToApp(payload, sheetName, silent) {
  var url = APP_URL + "/api/sync-push";
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    
    if (!silent) {
      if (result.success || result.status === "online") {
        SpreadsheetApp.getUi().alert("Sukses! Data dari sheet '" + sheetName + "' telah dikirim ke aplikasi.");
      } else {
        SpreadsheetApp.getUi().alert("Gagal: " + (result.error || "Terjadi kesalahan saat mengirim data."));
      }
    }
    return true;
  } catch (e) {
    if (!silent) SpreadsheetApp.getUi().alert("Error: " + e.toString());
    return false;
  }
}

/**
 * Ekstrak periode (YYYY-MM) dari nama sheet (misal: "Januari 2026")
 */
function extractPeriod(name) {
  var monthMap = {
    "januari": "01", "februari": "02", "maret": "03", "april": "04", "mei": "05", "juni": "06",
    "juli": "07", "agustus": "08", "september": "09", "oktober": "10", "november": "11", "desember": "12",
    "jan": "01", "feb": "02", "mar": "03", "apr": "04", "may": "05", "jun": "06",
    "jul": "07", "aug": "08", "sep": "09", "oct": "10", "nov": "11", "dec": "12"
  };
  
  var cleanName = name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  var parts = cleanName.split(/\s+/);
  
  var m = "";
  var y = "";
  
  for (var i = 0; i < parts.length; i++) {
    if (monthMap[parts[i]]) m = monthMap[parts[i]];
    if (parts[i].length === 4 && !isNaN(parts[i])) y = parts[i];
  }
  
  if (m && y) return y + "-" + m;
  
  // Fallback ke bulan/tahun saat ini jika tidak ketemu
  var now = new Date();
  return now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2);
}

/**
 * Ekstrak tahun dari nama sheet
 */
function extractYear(name) {
  var match = name.match(/\d{4}/);
  return match ? parseInt(match[0]) : new Date().getFullYear();
}

function showSettings() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt('Pengaturan URL Aplikasi', 'Masukkan URL aplikasi Anda (tanpa /api):', ui.ButtonSet.OK_CANCEL);
  
  if (result.getSelectedButton() == ui.Button.OK) {
    var url = result.getResponseText().replace(/\/$/, "");
    // Simpan di script properties jika ingin permanen
    PropertiesService.getScriptProperties().setProperty('APP_URL', url);
    ui.alert('URL diperbarui ke: ' + url + '\nCatatan: Anda mungkin perlu memperbarui variabel APP_URL di dalam kode script.');
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
