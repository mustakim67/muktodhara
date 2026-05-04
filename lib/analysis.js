export const calculateBlockadeRisk = (latestLog, weatherForecast) => {
  if (!latestLog) return { percentage: 0, level: 'STABLE' };

  // Calculate Rate of Change (if possible, compare with log before)
  // For now: Depth (Max 40) + Diff (Max 20) + Weather (Max 40)
  
  const depthScore = (latestLog.water_depth / 200) * 40; 
  const obstructionScore = (latestLog.diff_level / 50) * 20;
  
  let weatherScore = 0;
  if (weatherForecast.length > 0) {
    const rainIntensity = weatherForecast[0].rain?.['3h'] || 0; 
    const isStorm = weatherForecast[0].weather[0].id < 300; // Thunderstorm
    
    weatherScore = isStorm ? 40 : (rainIntensity > 5 ? 30 : 10);
  }

  const total = Math.min(Math.round(depthScore + obstructionScore + weatherScore), 100);

  return {
    percentage: total,
    level: total > 80 ? 'CRITICAL' : total > 50 ? 'ELEVATED' : 'STABLE'
  };
};