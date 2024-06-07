const { Requisition } = require("../config/sequelize");
const logger = require("../middlewares/logger");

exports.submitRequisition = async (req, res) => {
  try {
    const { item_name, quantity, purpose, required_date, description } =
      req.body;
    const requisition = await Requisition.create({
      item_name,
      quantity,
      purpose,
      required_date,
      status: "Pending",
      created_by: req.user.id,
      description,
    });

    logger.info("Requisition submitted:", requisition); // Add logger statement

    res.status(201).json(requisition);
  } catch (error) {
    logger.error(`Error submitting requisition: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getRequisitionStatus = async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      return res.status(404).json({ message: "Requisition not found" });
    }

    logger.info("Requisition status fetched:", requisition.status); // Add logger statement

    res.status(200).json({ status: requisition.status });
  } catch (error) {
    logger.error(`Error fetching requisition status: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.approveRequisition = async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      return res.status(404).json({ message: "Requisition not found" });
    }

    const approvalField = `approval_${req.user.role.toLowerCase()}`;
    const approvalDateField = `approved_date_${req.user.role.toLowerCase()}`;

    if (req.body.status === "Approved") {
      requisition[approvalField] = "Approved";
      requisition[approvalDateField] = new Date();
      requisition.current_approval_step = getNextApprovalStep(req.user.role);
    } else {
      requisition[approvalField] = "Rejected";
      requisition.status = "Rejected";
    }

    requisition.notes = req.body.notes || requisition.notes;
    requisition.comments = req.body.comments || requisition.comments;

    if (
      requisition.current_approval_step === null &&
      req.body.status === "Approved"
    ) {
      requisition.status = "Approved";
    }

    await requisition.save();

    logger.info("Requisition approved:", requisition); // Add logger statement

    res.status(200).json(requisition);
  } catch (error) {
    logger.error(`Error approving requisition: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getNextApprovalStep = (currentRole) => {
  const steps = ["JE", "AEE", "EEE", "ESE", "CE"];
  const currentIndex = steps.indexOf(currentRole);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
};

exports.listRequisitions = async (req, res) => {
  try {
    const requisitions = await Requisition.findAll();

    logger.info("Requisitions listed:", requisitions); // Add logger statement

    res.status(200).json(requisitions);
  } catch (error) {
    logger.error(`Error listing requisitions: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
