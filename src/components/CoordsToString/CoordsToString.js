/**
 * Преобразование координат в строку
 * @function
 * @param {array} [lat, long] координаты точки (ширина, долгота)
 * @return {string} строка в формате: "Градусы, минуты, секунды"
 */
export default function (coords) {

  const coordConvert = (coordinate) => {
    let deg = Math.floor(coordinate);
    const minutesWithSeconds = (coordinate - deg) * 3600 / 60;

    let minutes = Math.floor(minutesWithSeconds);
    let seconds = Math.floor((minutesWithSeconds - minutes) * 60);

    deg += '';
    minutes += '';
    seconds += '';

    deg = [deg.length < 2 ? '0' : '',...deg].join('');
    minutes = [minutes.length<2 ? '0' : '',...minutes].join('');
    seconds = [seconds.length<2 ? '0' : '',...seconds].join('');

    return `${deg}${"\u00B0"}${minutes}${"\u2032"}${seconds}${"\u2033"}`;
  }

  return `${coordConvert(coords[0])}  ${coordConvert(coords[1])}`
}
