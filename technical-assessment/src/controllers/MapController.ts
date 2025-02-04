import { RefObject } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';

// Store
import store from './../store/store';
import { setMapLoaded } from '../store/slices/mapSlice';

// Config
import { firesFeatureLayer } from '../configs/layers.config.ts';

export const esriMap = new Map({
  basemap: 'gray',
});

/**
 * Controller used to manage anything map related.
 */
class MapController {
  #map?: __esri.Map = esriMap;
  #mapview?: __esri.MapView;
  #mapLayers?: __esri.Layer[];
  firesLayerView: __esri.FeatureLayerView | undefined;

  /**
   * Initialize the MapView and Map
   * @param domRef - the dom element to render the map onto
   */
  initializeMap = async (domRef: RefObject<HTMLDivElement>) => {
    if (!domRef.current) {
      return;
    }

    this.#mapview = new MapView({
      map: esriMap,
      container: domRef.current,
      center: [-98.5795, 39.8283],
      constraints: {
        minScale: 25000000,
        maxScale: 10000,
      },
    });

    this.#mapview?.ui.move('zoom', 'top-right');
    this.#mapview?.ui.add(['control-panel'], 'top-right');

    this.#mapview?.when(() => {
      this.#mapLayers = [];

      this.#mapLayers.push(firesFeatureLayer);
      esriMap?.add(firesFeatureLayer);

      this.#mapview?.whenLayerView(firesFeatureLayer)?.then((featureLayerView) => {
        this.firesLayerView = featureLayerView;
      });

      if (!this.scaleBarAdded) {
        const scaleBar = new ScaleBar({
          view: this.#mapview,
          unit: 'imperial',
        });
        this.#mapview?.ui.add(scaleBar, 'bottom-right');
        this.scaleBarAdded = true;
      }

      if (!this.basemapGalleryAdded) {
        const basemapGallery = new BasemapGallery({
          view: this.#mapview,
          container: document.createElement('div'),
        });
        this.#mapview?.ui.add(basemapGallery, 'top-right');
        this.basemapGalleryAdded = true;
      }
      store.dispatch(setMapLoaded(true));
    });
  };

  // updateLayerVisibility = (id: string) => {
  //   // DOCS that may help: https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#visible
  // };

  updateLayerVisibility = (id: string, isVisible: boolean) => {
    const layer = this.#map?.findLayerById(id);
    if (layer) {
      layer.visible = isVisible;
    } else {
      console.error('Layer not found:', id);
    }
  };

  updateFeatureFilter = async (brightness: number, confidence: number) => {
    if (this.firesLayerView) {
      const where = `brightness > ${brightness} AND percent_confidence > ${confidence}`;
      this.firesLayerView.filter = new FeatureFilter({
        where: where,
      });
    }
  };

  get map() {
    return this.#map;
  }

  get mapView() {
    return this.#mapview;
  }

  get mapLayers() {
    return this.#mapLayers;
  }
}

const mapController = new MapController();

declare global {
  interface Window {
    mapController: typeof mapController;
  }
}

if (process.env.NODE_ENV === 'development') {
  window.mapController = mapController;
}

export default mapController;
