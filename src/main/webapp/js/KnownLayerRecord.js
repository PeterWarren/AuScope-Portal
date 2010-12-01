/**
 * A representation of a KnownLayerRecord in the user interface (as returned by the getKnownFeatures.do handler).
 */
KnownLayerRecord = function(dataStoreRecord) {
	this.internalRecord = dataStoreRecord;
};


KnownLayerRecord.prototype.internalRecord = null;
KnownLayerRecord.prototype.internalGetStringField = function(fieldName) {
	var str = this.internalRecord.get(fieldName);
	if (!str) {
		return '';
	}
	
	return str;
};
KnownLayerRecord.prototype.internalGetBooleanField = function(fieldName) {
	var b = this.internalRecord.get(fieldName);
	if (b == null || b == undefined) {
		return false;
	}
	
	return b;
};

/**
 * Gets the type of this known layer.
 * 
 * Can be ['KnownLayerWFS', 'KnownLayerWMS', 'KnownLayerKeywords']
 */
KnownLayerRecord.prototype.getType = function() {
	return this.internalGetStringField('type');
};

/**
 * Gets an array of String feature type names
 * Gets every feature type name that is related to this feature type. Only valid if type=='KnownLayerWFS'
 */
KnownLayerRecord.prototype.getRelatedFeatureTypeNames = function() {
	var recs = this.internalRecord.get('relatedFeatureTypeNames');
	if (!recs) {
		return [];
	}
	
	return recs;
};

/**
 * Gets whether this known layer should be hidden from the user as a boolean
 */
KnownLayerRecord.prototype.getHidden = function() {
	return this.internalGetStringField('hidden');
};

/**
 * Gets the id of this known layer as a String.
 */
KnownLayerRecord.prototype.getId = function() {
	return this.internalGetStringField('id');
};

/**
 * Gets the feature type as a String. Only valid if type=='KnownLayerWFS'
 */
KnownLayerRecord.prototype.getFeatureTypeName = function() {
	return this.internalGetStringField('featureTypeName');
};

/**
 * Gets whether bounding box filtering should be disabled for this known layer. 
 * Only valid if type=='KnownLayerWFS'
 */
KnownLayerRecord.prototype.getDisableBboxFiltering = function() {
	return this.internalGetStringField('disableBboxFiltering');
};

/**
 * Gets the display name as a String
 */
KnownLayerRecord.prototype.getTitle = function() {
	return this.internalGetStringField('title');
};

/**
 * Gets the description as a String
 */
KnownLayerRecord.prototype.getDescription = function() {
	return this.internalGetStringField('description');
};

/**
 * Gets the proxy URL as a String. Only valid if type=='KnownLayerWFS'
 */
KnownLayerRecord.prototype.getProxyUrl = function() {
	return this.internalGetStringField('proxyUrl');
};

/**
 * Gets the icon URL as a String. Only valid if type=='KnownLayerWFS'
 */
KnownLayerRecord.prototype.getIconUrl = function() {
	return this.internalGetStringField('iconUrl');
};

/**
 * Gets the descriptive keyword as a String. Only valid if type=='KnownLayerKeywords'
 */
KnownLayerRecord.prototype.getDescriptiveKeyword = function() {
	return this.internalGetStringField('descriptiveKeyword');
};

/**
 * Gets the layer name as a String. Only valid if type=='KnownLayerWMS'
 */
KnownLayerRecord.prototype.getLayerName = function() {
	return this.internalGetStringField('layerName');
};

/**
 * Gets the style name as a String. Only valid if type=='KnownLayerWMS'
 */
KnownLayerRecord.prototype.getStyleName = function() {
	return this.internalGetStringField('styleName');
};

/**
 * Gets the icon anchor location as an Object. Only valid if type=='KnownLayerWFS'
 * {
 * 	x : Number
 * 	y : Number
 * }
 */
KnownLayerRecord.prototype.getIconAnchor = function() {
	return this.internalGetStringField('iconAnchor');
};

/**
 * Gets the info window anchor location as an Object. Only valid if type=='KnownLayerWFS'
 * {
 * 	x : Number
 * 	y : Number
 * }
 */
KnownLayerRecord.prototype.getInfoWindowAnchor = function() {
	return this.internalGetStringField('infoWindowAnchor');
};

/**
 * Gets the icon size as an Object. Only valid if type=='KnownLayerWFS'
 * {
 * 	width  : Number
 * 	height : Number
 * }
 */
KnownLayerRecord.prototype.getIconSize = function() {
	return this.internalGetStringField('iconSize');
};

/**
* Gets an OverlayManager that holds the list of bounding boxes for this layer (or null/undefined)
*/
KnownLayerRecord.prototype.getBboxOverlayManager = function() {
	return this.internalRecord.bboxOverlayManager;
};

/**
* Sets an OverlayManager that holds the list of bounding boxes for this layer (or null/undefined)
*/
KnownLayerRecord.prototype.setBboxOverlayManager = function(bboxOverlayManager) {
	this.internalRecord.bboxOverlayManager = bboxOverlayManager;
};

/**
 * Given a CSWRecordStore this function will return an array of CSWRecords that 
 * this KnownLayerRecord is representing
 */
KnownLayerRecord.prototype.getLinkedCSWRecords = function(cswRecordStore) {
	var type = this.getType();
	
	//Internal cache added for AUS-1968
	if (this.internalRecord.cachedLinkedRecords) {
		return this.internalRecord.cachedLinkedRecords;
	}
	
	switch (this.getType()) {
	case 'KnownLayerWFS':
		var featureTypeName = this.getFeatureTypeName();
		this.internalRecord.cachedLinkedRecords = cswRecordStore.getCSWRecordsByOnlineResource(featureTypeName, null);
		return this.internalRecord.cachedLinkedRecords;
	case 'KnownLayerWMS':
		var layerName = this.getLayerName();
		this.internalRecord.cachedLinkedRecords = cswRecordStore.getCSWRecordsByOnlineResource(layerName, null);
		return this.internalRecord.cachedLinkedRecords;
	case 'KnownLayerKeywords':
		var keyword = this.getDescriptiveKeyword();
		this.internalRecord.cachedLinkedRecords = cswRecordStore.getCSWRecordsByKeyword(keyword);
		return cswRecordStore.getCSWRecordsByKeyword(keyword);
	}
	
	return [];
};

/**
 * Given a CSWRecordStore this function will return an array of CSWRecords that 
 * this KnownLayerRecord is 'related' to. How that relation is defined depends on the
 * KnownLayer type.
 */
KnownLayerRecord.prototype.getRelatedCSWRecords = function(cswRecordStore) {
	var type = this.getType();
	
	//Internal cache added for AUS-1968
	if (this.internalRecord.cachedRelatedRecords) {
		return this.internalRecord.cachedRelatedRecords;
	}
	
	switch (type) {
	case 'KnownLayerWFS':
		var featureTypeNames = this.getRelatedFeatureTypeNames();
		var relatedRecs = [];
		
		for (var i = 0; i < featureTypeNames.length; i++) {
			relatedRecs = relatedRecs.concat(cswRecordStore.getCSWRecordsByOnlineResource(featureTypeNames[i], null));
		}
		
		this.internalRecord.cachedRelatedRecords = relatedRecs;
		return this.internalRecord.cachedRelatedRecords;
	}
	
	return [];
};
