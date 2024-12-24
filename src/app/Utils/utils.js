import API from "Constance";
import { differenceInSeconds } from "date-fns";
import moment from "moment";
import { useDispatch } from "react-redux";

export const convertHexToRGB = (hex) => {
  // check if it's a rgba
  if (hex.match("rgba")) {
    let triplet = hex.slice(5).split(",").slice(0, -1).join(",");
    return triplet;
  }

  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");

    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
  }
};

function currentYPosition(elm) {
  if (!window && !elm) return;

  if (elm) return elm.scrollTop;
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  var elm = document.getElementById(elmID);

  if (!elmID || !elm) {
    return;
  }

  var startY = currentYPosition(scrollableElement);
  var stopY = elmYPosition(elm);

  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  let difference = differenceInSeconds(new Date(), date);

  if (difference < 60) return `${Math.floor(difference)} sec`;
  else if (difference < 3600) return `${Math.floor(difference / 60)} min`;
  else if (difference < 86400) return `${Math.floor(difference / 3660)} h`;
  else if (difference < 86400 * 30) return `${Math.floor(difference / 86400)} d`;
  else if (difference < 86400 * 30 * 12) return `${Math.floor(difference / 86400 / 30)} mon`;
  else return `${(difference / 86400 / 30 / 12).toFixed(1)} y`;
}


export function getDateAfterDays(days) {
  return moment().add(days, 'days').format('YYYY-MM-DD');
}

export const getDate = (date, format = "DD-MM-YYYY") => {
  if (date == (null || '')) {
    return moment().format(format)
  } else {
    return date != ('' || null) ? moment(date).format(format) : ''
  }
}

export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5, // Default max size in MB
    allowedTypes = [], // Array of allowed MIME types
    allowedExtensions = [] // Array of allowed file extensions
  } = options;

  const errors = [];

  // Check file size
  const fileSize = file.size / (1024 * 1024); // Convert to MB
  if (fileSize > maxSize) {
    errors.push(`File size must be less than ${maxSize}MB`);
  }

  // Check file type if specified
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  // Check file extension if specified
  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push(`File extension must be one of: ${allowedExtensions.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const handleFileUpload = async (file, options = {}) => {
  // const dispatch = useDispatch()
  try {
    // Validate file
    const validation = validateFile(file, options);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    if (!validation.isValid) return
    // Create FormData
    const formData = new FormData()
    if (file.type.startsWith('image/')) {
      formData.append('image', file);
    } else if (file.type === 'application/pdf') {
      formData.append('pdf', file);
    }


    // Add any additional data
    if (options.additionalData) {
      Object.entries(options.additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    let response;
    try {
      response = await API.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return {
      message: response.data.message,
      success: true,
      formData,
      file: response.data.files[0]
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};


export const getDeviceType = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  if (mobileRegex.test(userAgent)) {
    return 'mobile';
  }
  
  return 'desktop';
};

export const isMobile = () => getDeviceType() === 'mobile';
export const isDesktop = () => getDeviceType() === 'desktop';

export const getDeviceInfo = () => {
  return {
    deviceType: getDeviceType(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    orientation: window.screen.orientation?.type || 'unknown'
  };
};