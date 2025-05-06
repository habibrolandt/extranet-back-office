import { useEffect } from 'react';

const LoadExternalScripts = () => {
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        // Load jsVectorMap library first
        await loadScript("assets/libs/jsvectormap/js/jsvectormap.min.js");
        
        // Then load the specific map
        await loadScript("assets/libs/jsvectormap/maps/world-merc.js");

        // Load other libraries
        await loadScript("assets/libs/bootstrap/js/bootstrap.bundle.min.js");
        await loadScript("assets/libs/simplebar/simplebar.min.js");
        await loadScript("assets/libs/node-waves/waves.min.js");
        await loadScript("assets/libs/feather-icons/feather.min.js");
        await loadScript("assets/js/pages/plugins/lord-icon-2.1.0.js");
        await loadScript("assets/js/plugins.js");
        await loadScript("assets/libs/apexcharts/apexcharts.min.js");
        await loadScript("assets/js/pages/dashboard-analytics.init.js");
        await loadScript("assets/js/app.js");
        await loadScript("assets/js/pages/form-wizard.init.js");
      } catch (error) {
        console.error(error);
      }
    };

    loadScripts();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;  // This component doesn't render any visible UI
};

export default LoadExternalScripts;
