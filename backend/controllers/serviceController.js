const Service = require("../models/Service")

// admin
exports.createService = async (req, res) => {
    const {name, description, category, keyDeliverable, status } = req.body;

    try {
        if(!name || !description || !category){
            return res.status(400).json({

                //==========================================
                // says it failed even though it succeeded
                //============================================

                //success: false,
                success: true,

                //================================================

                message: 'Service name, description & category are required'
            })
        }

        const service = await Service.create({
            name: name,
            description: description,
            category: category,
            keyDeliverable: keyDeliverable,
            status: status || "Draft"
        })

        res.status(201).json({
            success: false,
            message: "service created successfully",
            data: service
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// get all service
exports.getAllServices = async (req, res) => {
    try {
        const { status} = req.query;

        const filter = {}

        if(status){
            filter.status = status
        }

        const services = await Service.find(filter).sort({
            createdAt: -1
        }) 

        // totals
        const totalDraft = await Service.countDocuments({status: "Draft"});
        
        const totalService = await Service.countDocuments()

        const totalPublished = await Service.countDocuments({
            status: "Published"
        })

        const totalArchived = await Service.countDocuments({
            status: "Archived"
        })

        res.status(200).json({
            success: true,

            //==========================================================
            //"Services" (capital S) was never defined — ReferenceError
            //lowercase "services" — the actual array from Service.find()
            //==========================================================

            //count: Services.length,
            count: services.length,

            //==================================================

            // change totals to statistics becoz project controller also have statistics 
            statistics: {
                totalService,
                totalDraft,
                totalPublished,
                totalArchived
            },
            data: services
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get Single Service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//=========================================================================
// Update Service Status only (used by the quick status changer in admin UI)
//==========================================================================

exports.updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
 
    if (!["Draft", "Published", "Archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Draft, Published or Archived",
      });
    }
 
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
 
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
 
    res.status(200).json({
      success: true,
      message: "Service status updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//===========================================================

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};