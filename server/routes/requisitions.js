const router = require('express').Router();
let Requisition = require('../models/requisition.model');

router.route('/').get((req, res) => {
  let query = {};
  if (req.query.createdBy) {
    query = { createdBy: req.query.createdBy };
  }

  Requisition.find(query)
    .populate('createdBy', 'username')
    .populate('approvedBy', 'username')
    .populate('rejectedBy', 'username')
    .then(requisitions => res.json(requisitions))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { title, description, items, totalCost, createdBy } = req.body;

  const newRequisition = new Requisition({
    title,
    description,
    items,
    totalCost,
    createdBy,
  });

  newRequisition.save()
    .then(() => res.json('Requisition added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Requisition.findById(req.params.id)
    .populate('createdBy', 'username')
    .populate('approvedBy', 'username')
    .populate('rejectedBy', 'username')
    .then(requisition => res.json(requisition))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Requisition.findById(req.params.id)
    .then(requisition => {
      requisition.title = req.body.title;
      requisition.description = req.body.description;
      requisition.items = req.body.items;
      requisition.totalCost = req.body.totalCost;
      requisition.status = req.body.status;
      requisition.approvedBy = req.body.approvedBy;
      requisition.rejectedBy = req.body.rejectedBy;
      requisition.rejectionReason = req.body.rejectionReason;
      requisition.processingNotes = req.body.processingNotes;

      requisition.save()
        .then(() => res.json('Requisition updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Requisition.findByIdAndDelete(req.params.id)
    .then(() => res.json('Requisition deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
