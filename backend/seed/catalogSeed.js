const BASE = "http://localhost:5000";

const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

const categories = [
  { name: "Living Room", description: "Sofas, lounge chairs, and coffee tables in solid timber", image: photo("photo-1555041469-a586c61ea9bc") },
  { name: "Dining Room", description: "Dining tables, benches, and chairs for everyday meals", image: photo("photo-1617806118233-18e1de247200") },
  { name: "Bedroom", description: "Beds, wardrobes, and bedside tables", image: photo("photo-1505693416388-ac5ce068fe85") },
  { name: "Home Office", description: "Desks, study tables, and bookshelves", image: photo("photo-1518455027359-f3f8164ba6bd") },
  { name: "Storage", description: "Sideboards, TV consoles, and cabinets", image: photo("photo-1595428774223-ef52624120d2") },
  { name: "Outdoor", description: "Teak benches and lounge seating for a balcony or garden", image: photo("photo-1506439773649-6e0eb8cfb237") },
  { name: "Kids Room", description: "Beds and study desks sized for a child's room", image: photo("photo-1616594039964-ae9021a400a0") },
  { name: "Entryway", description: "Console tables and shoe cabinets for the front of the home", image: photo("photo-1533090161767-e6ffed986c88") },
  { name: "Bar Furniture", description: "Bar cabinets and stools for a dining or living corner", image: photo("photo-1567538096630-e0c55bd6374c") },
  { name: "Accent Tables", description: "Side tables and nesting tables for a sofa or bed", image: photo("photo-1538688525198-9b88f6f53126") },
];

const products = [
  {
    category: "Living Room",
    name: "Sheesham 3-Seater Sofa",
    brand: "WoodCraft Studio",
    image: photo("photo-1555041469-a586c61ea9bc"),
    short_description: "Low-profile living room sofa in seasoned Sheesham with deep seat cushions.",
    description: "A three-seat sofa built from seasoned Sheesham. The frame is joined for daily living-room use, with removable cushions and a warm timber tone.",
    mrp: 68990, selling_price: 54990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 210, width: 88, height: 84, weight: 42, seating_capacity: 3, assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 8 },
      { variant_name: "Walnut Finish", color: "Walnut", stock_quantity: 5 },
    ],
  },
  {
    category: "Living Room",
    name: "Teak L-Shaped Sectional",
    brand: "WoodCraft Studio",
    image: photo("photo-1493663284031-b7e3aefcae8e"),
    short_description: "Corner sectional in solid teak for a larger living room.",
    description: "An L-shaped sectional with a teak frame and firm seat cushions. Sized for a family living room.",
    mrp: 112990, selling_price: 94990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 260, width: 160, height: 86, weight: 68, seating_capacity: 5, assembly_required: "YES", delivery_days: 12,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 4 },
      { variant_name: "Dark Polish", color: "Dark Brown", stock_quantity: 3 },
    ],
  },
  {
    category: "Living Room",
    name: "Oak Lounge Chair",
    brand: "WoodCraft Studio",
    image: photo("photo-1567538096630-e0c55bd6374c"),
    short_description: "Single lounge chair in oak with a linen seat.",
    description: "An oak lounge chair with a linen cushion. The arms are wide enough to rest a book.",
    mrp: 24990, selling_price: 19990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 78, width: 80, height: 86, weight: 14, seating_capacity: 1, assembly_required: "NO", delivery_days: 5,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 12 },
      { variant_name: "Smoked Oak", color: "Smoked", stock_quantity: 6 },
    ],
  },
  {
    category: "Living Room",
    name: "Sheesham Coffee Table",
    brand: "WoodCraft Studio",
    image: photo("photo-1533090161767-e6ffed986c88"),
    short_description: "Rectangular coffee table with a lower shelf for books.",
    description: "A Sheesham coffee table with a lower shelf. The corners are eased and the finish is matte.",
    mrp: 18990, selling_price: 14990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 110, width: 60, height: 42, weight: 16, seating_capacity: "", assembly_required: "NO", delivery_days: 5,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 10 },
      { variant_name: "Espresso Finish", color: "Espresso", stock_quantity: 7 },
    ],
  },
  {
    category: "Dining Room",
    name: "Teak 6-Seater Dining Set",
    brand: "WoodCraft Studio",
    image: photo("photo-1617806118233-18e1de247200"),
    short_description: "Solid teak dining table with six chairs for family meals.",
    description: "A six-seater dining table in solid teak with matching chairs. The top is finished to show the grain.",
    mrp: 92990, selling_price: 79990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 180, width: 90, height: 76, weight: 68, seating_capacity: 6, assembly_required: "YES", delivery_days: 10,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 4 },
      { variant_name: "Walnut Stain", color: "Walnut", stock_quantity: 3 },
    ],
  },
  {
    category: "Dining Room",
    name: "Sheesham 4-Seater Dining Table",
    brand: "WoodCraft Studio",
    image: photo("photo-1604578762246-41134e37f9cc"),
    short_description: "Compact four-seater table for an apartment dining room.",
    description: "A four-seat Sheesham dining table with a thick top and tapered legs. Chairs are sold with the table.",
    mrp: 54990, selling_price: 46990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 140, width: 80, height: 76, weight: 38, seating_capacity: 4, assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 6 },
      { variant_name: "Provincial Teak Tone", color: "Brown", stock_quantity: 4 },
    ],
  },
  {
    category: "Dining Room",
    name: "Oak Dining Bench",
    brand: "WoodCraft Studio",
    image: photo("photo-1530018607912-eff2daa1bac4"),
    short_description: "Solid oak bench that seats two beside a dining table.",
    description: "A backless oak bench for a dining table. The seat is sanded smooth and finished with a clear coat.",
    mrp: 16990, selling_price: 13990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 140, width: 36, height: 46, weight: 12, seating_capacity: 2, assembly_required: "NO", delivery_days: 6,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 9 },
      { variant_name: "Grey Oak", color: "Grey", stock_quantity: 5 },
    ],
  },
  {
    category: "Bedroom",
    name: "Solid Oak King Bed",
    brand: "WoodCraft Studio",
    image: photo("photo-1505693416388-ac5ce068fe85"),
    short_description: "King platform bed in oak with a low headboard.",
    description: "A king platform bed in solid oak. The slats support a standard mattress without a box spring.",
    mrp: 74990, selling_price: 62990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 210, width: 190, height: 110, weight: 72, seating_capacity: "", assembly_required: "YES", delivery_days: 9,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 4 },
      { variant_name: "Weathered Oak", color: "Weathered", stock_quantity: 3 },
    ],
  },
  {
    category: "Bedroom",
    name: "Walnut Queen Bed",
    brand: "WoodCraft Studio",
    image: photo("photo-1616594039964-ae9021a400a0"),
    short_description: "Queen bed in walnut with a panel headboard.",
    description: "A queen bed in walnut. The headboard is a solid panel and the frame uses slats for the mattress.",
    mrp: 68990, selling_price: 57990, material: "Solid Wood", wood_type: "Walnut Wood",
    length: 210, width: 160, height: 120, weight: 64, seating_capacity: "", assembly_required: "YES", delivery_days: 9,
    variants: [
      { variant_name: "American Walnut", color: "Walnut", stock_quantity: 5 },
      { variant_name: "Dark Walnut", color: "Dark Brown", stock_quantity: 3 },
    ],
  },
  {
    category: "Bedroom",
    name: "Teak Nightstand",
    brand: "WoodCraft Studio",
    image: photo("photo-1551298370-9d3d53740c72"),
    short_description: "One-drawer teak nightstand with an open shelf.",
    description: "A teak bedside table with one drawer and an open shelf for books. Sold as a single piece.",
    mrp: 12990, selling_price: 9990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 45, width: 40, height: 55, weight: 10, seating_capacity: "", assembly_required: "NO", delivery_days: 5,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 14 },
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 8 },
    ],
  },
  {
    category: "Bedroom",
    name: "Walnut 3-Door Wardrobe",
    brand: "WoodCraft Studio",
    image: photo("photo-1558997519-83ea9252edf8"),
    short_description: "Three-door wardrobe in walnut with a hanging rail and shelves.",
    description: "A three-door walnut wardrobe with a hanging rail, two shelves, and space for standard hangers.",
    mrp: 85990, selling_price: 72990, material: "Solid Wood", wood_type: "Walnut Wood",
    length: 160, width: 58, height: 210, weight: 90, seating_capacity: "", assembly_required: "YES", delivery_days: 12,
    variants: [
      { variant_name: "Walnut", color: "Walnut", stock_quantity: 3 },
      { variant_name: "Espresso", color: "Espresso", stock_quantity: 2 },
    ],
  },
  {
    category: "Home Office",
    name: "Walnut Writing Desk",
    brand: "WoodCraft Studio",
    image: photo("photo-1518455027359-f3f8164ba6bd"),
    short_description: "Compact walnut desk with a drawer for a home office.",
    description: "A writing desk in walnut with one drawer and a cable gap. The top fits a laptop and a lamp.",
    mrp: 32990, selling_price: 27990, material: "Solid Wood", wood_type: "Walnut Wood",
    length: 120, width: 60, height: 76, weight: 28, seating_capacity: 1, assembly_required: "NO", delivery_days: 6,
    variants: [
      { variant_name: "Walnut", color: "Walnut", stock_quantity: 7 },
      { variant_name: "Dark Walnut", color: "Dark Brown", stock_quantity: 4 },
    ],
  },
  {
    category: "Home Office",
    name: "Sheesham Study Table",
    brand: "WoodCraft Studio",
    image: photo("photo-1519710164239-da123dc03ef4"),
    short_description: "Study table in Sheesham with a modesty panel.",
    description: "A Sheesham study table for a bedroom or office. The top is deep enough for books and a monitor.",
    mrp: 28990, selling_price: 23990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 140, width: 65, height: 76, weight: 30, seating_capacity: 1, assembly_required: "YES", delivery_days: 7,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 6 },
      { variant_name: "Provincial Finish", color: "Brown", stock_quantity: 5 },
    ],
  },
  {
    category: "Home Office",
    name: "Teak Open Bookshelf",
    brand: "WoodCraft Studio",
    image: photo("photo-1594620302200-9a762244a156"),
    short_description: "Five-shelf teak bookcase for a living room or study.",
    description: "An open teak bookshelf with five shelves for books, ceramics, and a small lamp.",
    mrp: 28990, selling_price: 23990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 80, width: 35, height: 180, weight: 32, seating_capacity: "", assembly_required: "YES", delivery_days: 7,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 6 },
      { variant_name: "Antique Finish", color: "Antique", stock_quantity: 4 },
    ],
  },
  {
    category: "Storage",
    name: "Oak TV Console",
    brand: "WoodCraft Studio",
    image: photo("photo-1594026112284-02bb6f3352fe"),
    short_description: "Low oak media console with two cabinets.",
    description: "An oak TV console with closed cabinets and a cable opening. The top holds a television up to 55 inches.",
    mrp: 34990, selling_price: 28990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 150, width: 42, height: 50, weight: 34, seating_capacity: "", assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 5 },
      { variant_name: "White Oak", color: "White Oak", stock_quantity: 4 },
    ],
  },
  {
    category: "Storage",
    name: "Sheesham Sideboard",
    brand: "WoodCraft Studio",
    image: photo("photo-1595428774223-ef52624120d2"),
    short_description: "Three-door sideboard for a dining room.",
    description: "A Sheesham sideboard with three doors and an adjustable shelf. It sits against a dining wall.",
    mrp: 42990, selling_price: 36990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 160, width: 45, height: 80, weight: 48, seating_capacity: "", assembly_required: "YES", delivery_days: 9,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 4 },
      { variant_name: "Chestnut Finish", color: "Chestnut", stock_quantity: 3 },
    ],
  },
  {
    category: "Living Room",
    name: "Sheesham 2-Seater Loveseat",
    brand: "WoodCraft Studio",
    image: photo("photo-1555041469-a586c61ea9bc"),
    short_description: "Compact two-seat sofa in Sheesham for a smaller living room.",
    description: "A two-seat loveseat in seasoned Sheesham. The frame matches the three-seater and fits an apartment living room.",
    mrp: 48990, selling_price: 39990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 150, width: 84, height: 82, weight: 32, seating_capacity: 2, assembly_required: "YES", delivery_days: 7,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 6 },
      { variant_name: "Walnut Finish", color: "Walnut", stock_quantity: 4 },
    ],
  },
  {
    category: "Dining Room",
    name: "Walnut Dining Chair",
    brand: "WoodCraft Studio",
    image: photo("photo-1503602642458-232111445657"),
    short_description: "Solid walnut dining chair sold as one seat.",
    description: "A walnut dining chair with a curved back. Order a set by adding the quantity you need for the table.",
    mrp: 8990, selling_price: 7490, material: "Solid Wood", wood_type: "Walnut Wood",
    length: 48, width: 46, height: 96, weight: 7, seating_capacity: 1, assembly_required: "NO", delivery_days: 5,
    variants: [
      { variant_name: "Walnut", color: "Walnut", stock_quantity: 20 },
      { variant_name: "Dark Walnut", color: "Dark Brown", stock_quantity: 12 },
    ],
  },
  {
    category: "Bedroom",
    name: "Oak Chest of Drawers",
    brand: "WoodCraft Studio",
    image: photo("photo-1595428774223-ef52624120d2"),
    short_description: "Five-drawer oak chest for clothing and linen.",
    description: "An oak chest with five drawers on wooden runners. It stands beside a bed or inside a dressing corner.",
    mrp: 38990, selling_price: 32990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 90, width: 48, height: 120, weight: 46, seating_capacity: "", assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 5 },
      { variant_name: "Weathered Oak", color: "Weathered", stock_quantity: 3 },
    ],
  },
  {
    category: "Bedroom",
    name: "Sheesham Dressing Table",
    brand: "WoodCraft Studio",
    image: photo("photo-1616594039964-ae9021a400a0"),
    short_description: "Dressing table in Sheesham with a mirror and two drawers.",
    description: "A Sheesham dressing table with a framed mirror and two drawers for small items.",
    mrp: 27990, selling_price: 22990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 100, width: 45, height: 150, weight: 28, seating_capacity: "", assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 4 },
      { variant_name: "Provincial Finish", color: "Brown", stock_quantity: 3 },
    ],
  },
  {
    category: "Home Office",
    name: "Teak Filing Cabinet",
    brand: "WoodCraft Studio",
    image: photo("photo-1524758631624-e2822e304c36"),
    short_description: "Two-drawer teak cabinet for files beside a desk.",
    description: "A teak filing cabinet with two deep drawers. It sits under or beside a writing desk.",
    mrp: 18990, selling_price: 15990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 45, width: 50, height: 70, weight: 22, seating_capacity: "", assembly_required: "NO", delivery_days: 6,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 7 },
      { variant_name: "Antique Finish", color: "Antique", stock_quantity: 4 },
    ],
  },
  {
    category: "Outdoor",
    name: "Teak Garden Bench",
    brand: "WoodCraft Studio",
    image: photo("photo-1506439773649-6e0eb8cfb237"),
    short_description: "Three-seat teak bench for a balcony or garden.",
    description: "A teak garden bench with a slatted seat and back. The timber is left to weather outdoors.",
    mrp: 24990, selling_price: 20990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 150, width: 58, height: 90, weight: 24, seating_capacity: 3, assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 6 },
      { variant_name: "Weathered Teak", color: "Weathered", stock_quantity: 4 },
    ],
  },
  {
    category: "Outdoor",
    name: "Teak Outdoor Lounge Chair",
    brand: "WoodCraft Studio",
    image: photo("photo-1567538096630-e0c55bd6374c"),
    short_description: "Low teak lounge chair for a patio.",
    description: "A low teak lounge chair with a reclined back. A cushion can be added after delivery.",
    mrp: 21990, selling_price: 17990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 80, width: 70, height: 78, weight: 12, seating_capacity: 1, assembly_required: "NO", delivery_days: 6,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 8 },
      { variant_name: "Dark Oil", color: "Dark Brown", stock_quantity: 5 },
    ],
  },
  {
    category: "Kids Room",
    name: "Oak Kids Single Bed",
    brand: "WoodCraft Studio",
    image: photo("photo-1505693416388-ac5ce068fe85"),
    short_description: "Single bed in oak with a low headboard for a child's room.",
    description: "An oak single bed with rounded corners and a low headboard. The slats fit a standard single mattress.",
    mrp: 32990, selling_price: 27990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 200, width: 100, height: 80, weight: 36, seating_capacity: "", assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 5 },
      { variant_name: "White Oak", color: "White Oak", stock_quantity: 4 },
    ],
  },
  {
    category: "Kids Room",
    name: "Sheesham Kids Study Desk",
    brand: "WoodCraft Studio",
    image: photo("photo-1518455027359-f3f8164ba6bd"),
    short_description: "Smaller Sheesham desk for homework.",
    description: "A compact Sheesham desk with one drawer. The height suits a school-age child.",
    mrp: 16990, selling_price: 13990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 100, width: 50, height: 68, weight: 18, seating_capacity: 1, assembly_required: "YES", delivery_days: 6,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 8 },
      { variant_name: "Walnut Finish", color: "Walnut", stock_quantity: 5 },
    ],
  },
  {
    category: "Entryway",
    name: "Sheesham Shoe Cabinet",
    brand: "WoodCraft Studio",
    image: photo("photo-1558997519-83ea9252edf8"),
    short_description: "Two-door shoe cabinet for an entryway.",
    description: "A Sheesham shoe cabinet with two doors and three shelves. It sits against an entry wall.",
    mrp: 19990, selling_price: 16990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 80, width: 35, height: 110, weight: 26, seating_capacity: "", assembly_required: "YES", delivery_days: 7,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 6 },
      { variant_name: "Chestnut Finish", color: "Chestnut", stock_quantity: 4 },
    ],
  },
  {
    category: "Entryway",
    name: "Teak Console Table",
    brand: "WoodCraft Studio",
    image: photo("photo-1533090161767-e6ffed986c88"),
    short_description: "Narrow teak console for keys, a lamp, and a mirror.",
    description: "A slim teak console table for an entry or behind a sofa. The lower shelf holds shoes or baskets.",
    mrp: 17990, selling_price: 14990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 110, width: 35, height: 80, weight: 16, seating_capacity: "", assembly_required: "NO", delivery_days: 6,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 7 },
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 5 },
    ],
  },
  {
    category: "Bar Furniture",
    name: "Walnut Bar Cabinet",
    brand: "WoodCraft Studio",
    image: photo("photo-1617806118233-18e1de247200"),
    short_description: "Walnut cabinet with bottle shelves and a serving top.",
    description: "A walnut bar cabinet with an open shelf for bottles and a closed cupboard below. The top is a serving surface.",
    mrp: 45990, selling_price: 38990, material: "Solid Wood", wood_type: "Walnut Wood",
    length: 100, width: 45, height: 110, weight: 40, seating_capacity: "", assembly_required: "YES", delivery_days: 9,
    variants: [
      { variant_name: "Walnut", color: "Walnut", stock_quantity: 4 },
      { variant_name: "Dark Walnut", color: "Dark Brown", stock_quantity: 3 },
    ],
  },
  {
    category: "Bar Furniture",
    name: "Oak Bar Stool",
    brand: "WoodCraft Studio",
    image: photo("photo-1506439773649-6e0eb8cfb237"),
    short_description: "Solid oak bar stool with a footrest.",
    description: "An oak bar stool with a footrest and a flat seat. Sold as one stool.",
    mrp: 7990, selling_price: 6490, material: "Solid Wood", wood_type: "Oak Wood",
    length: 40, width: 40, height: 75, weight: 6, seating_capacity: 1, assembly_required: "NO", delivery_days: 5,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 16 },
      { variant_name: "Smoked Oak", color: "Smoked", stock_quantity: 10 },
    ],
  },
  {
    category: "Accent Tables",
    name: "Sheesham Nesting Tables",
    brand: "WoodCraft Studio",
    image: photo("photo-1538688525198-9b88f6f53126"),
    short_description: "Set of two nesting side tables in Sheesham.",
    description: "A pair of nesting tables that slide together beside a sofa. The smaller table tucks under the larger one.",
    mrp: 14990, selling_price: 11990, material: "Solid Wood", wood_type: "Sheesham (Indian Rosewood)",
    length: 50, width: 40, height: 50, weight: 9, seating_capacity: "", assembly_required: "NO", delivery_days: 5,
    variants: [
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 8 },
      { variant_name: "Walnut Finish", color: "Walnut", stock_quantity: 5 },
    ],
  },
  {
    category: "Accent Tables",
    name: "Oak Round Side Table",
    brand: "WoodCraft Studio",
    image: photo("photo-1533090161767-e6ffed986c88"),
    short_description: "Small round oak table for a lamp or a cup.",
    description: "A round oak side table with a lower shelf. It fits next to a lounge chair or bed.",
    mrp: 9990, selling_price: 7990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 45, width: 45, height: 55, weight: 7, seating_capacity: "", assembly_required: "NO", delivery_days: 5,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 10 },
      { variant_name: "Smoked Oak", color: "Smoked", stock_quantity: 6 },
    ],
  },
  {
    category: "Storage",
    name: "Walnut Display Cabinet",
    brand: "WoodCraft Studio",
    image: photo("photo-1594620302200-9a762244a156"),
    short_description: "Glass-front walnut cabinet for dishes or books.",
    description: "A tall walnut display cabinet with shelves behind doors. It stands in a dining room or living room.",
    mrp: 52990, selling_price: 44990, material: "Solid Wood", wood_type: "Walnut Wood",
    length: 90, width: 40, height: 180, weight: 52, seating_capacity: "", assembly_required: "YES", delivery_days: 10,
    variants: [
      { variant_name: "Walnut", color: "Walnut", stock_quantity: 3 },
      { variant_name: "Dark Walnut", color: "Dark Brown", stock_quantity: 2 },
    ],
  },
  {
    category: "Outdoor",
    name: "Teak Outdoor Dining Table",
    brand: "WoodCraft Studio",
    image: photo("photo-1604578762246-41134e37f9cc"),
    short_description: "Four-seat teak table for a balcony or terrace.",
    description: "A teak outdoor dining table with a slatted top so rain can drain. Seats four.",
    mrp: 42990, selling_price: 36990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 140, width: 80, height: 75, weight: 28, seating_capacity: 4, assembly_required: "YES", delivery_days: 8,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 4 },
      { variant_name: "Weathered Teak", color: "Weathered", stock_quantity: 3 },
    ],
  },
  {
    category: "Kids Room",
    name: "Oak Toy Storage Bench",
    brand: "WoodCraft Studio",
    image: photo("photo-1558997519-83ea9252edf8"),
    short_description: "Lift-top oak bench that stores toys.",
    description: "An oak storage bench with a hinged lid. It sits at the foot of a child's bed.",
    mrp: 15990, selling_price: 12990, material: "Solid Wood", wood_type: "Oak Wood",
    length: 90, width: 40, height: 45, weight: 14, seating_capacity: 2, assembly_required: "YES", delivery_days: 6,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 6 },
      { variant_name: "White Oak", color: "White Oak", stock_quantity: 4 },
    ],
  },
  {
    category: "Entryway",
    name: "Oak Hall Bench",
    brand: "WoodCraft Studio",
    image: photo("photo-1506439773649-6e0eb8cfb237"),
    short_description: "Entry bench in oak with a shelf for shoes.",
    description: "A solid oak bench for putting on shoes. The lower shelf holds a pair of everyday shoes.",
    mrp: 18990, selling_price: 15490, material: "Solid Wood", wood_type: "Oak Wood",
    length: 100, width: 38, height: 48, weight: 15, seating_capacity: 2, assembly_required: "NO", delivery_days: 6,
    variants: [
      { variant_name: "Natural Oak", color: "Natural", stock_quantity: 5 },
      { variant_name: "Weathered Oak", color: "Weathered", stock_quantity: 4 },
    ],
  },
  {
    category: "Dining Room",
    name: "Teak Buffet Server",
    brand: "WoodCraft Studio",
    image: photo("photo-1594026112284-02bb6f3352fe"),
    short_description: "Long teak buffet for serving and storage.",
    description: "A teak buffet with drawers and cupboards. It sits against a dining wall.",
    mrp: 48990, selling_price: 41990, material: "Solid Wood", wood_type: "Teak Wood",
    length: 170, width: 45, height: 80, weight: 50, seating_capacity: "", assembly_required: "YES", delivery_days: 9,
    variants: [
      { variant_name: "Natural Teak", color: "Natural", stock_quantity: 3 },
      { variant_name: "Honey Finish", color: "Honey", stock_quantity: 3 },
    ],
  },
  {
    category: "Living Room",
    name: "Walnut Armchair",
    brand: "WoodCraft Studio",
    image: photo("photo-1567538096630-e0c55bd6374c"),
    short_description: "Single walnut armchair with a cushioned seat.",
    description: "A walnut armchair with a high back and a firm cushion. Use it as an extra living-room seat.",
    mrp: 22990, selling_price: 18990, material: "Solid Wood", wood_type: "Walnut Wood",
    length: 72, width: 74, height: 92, weight: 13, seating_capacity: 1, assembly_required: "NO", delivery_days: 6,
    variants: [
      { variant_name: "Walnut", color: "Walnut", stock_quantity: 7 },
      { variant_name: "Dark Walnut", color: "Dark Brown", stock_quantity: 4 },
    ],
  },
];

async function api(path, { method = "GET", token, body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const response = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${method} ${path} ${response.status}: ${data.message || "request failed"}`);
  }
  return data;
}

async function imageFile(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`status ${response.status}`);
    const bytes = await response.arrayBuffer();
    return new File([bytes], filename, { type: "image/jpeg" });
  } catch (error) {
    const fs = require("fs");
    const path = require("path");
    const dir = path.join(__dirname, "../uploads/products");
    const fallback = fs.readdirSync(dir).find((file) => /\.(jpe?g|png|webp)$/i.test(file));
    if (!fallback) throw error;
    return new File([fs.readFileSync(path.join(dir, fallback))], filename, { type: "image/jpeg" });
  }
}

async function main() {
  const login = await api("/api/admin/auth/login", {
    method: "POST",
    body: { email: "admin@furniture.com", password: "Admin@123" },
  });
  const token = login.token;

  const existingCategories = await api("/api/admin/categories", { token });
  const categoryByName = new Map(
    (existingCategories.categories || []).map((category) => [category.name, category])
  );

  for (const category of categories) {
    if (categoryByName.has(category.name)) continue;
    const created = await api("/api/admin/categories", { method: "POST", token, body: category });
    categoryByName.set(category.name, created.category);
    console.log("Category", category.name);
  }

  for (const category of categories) {
    const current = categoryByName.get(category.name);
    if (!current?.id || !category.image) continue;
    const updated = await api(`/api/admin/categories/${current.id}`, {
      method: "PUT",
      token,
      body: {
        name: category.name,
        description: category.description,
        image: category.image,
      },
    });
    categoryByName.set(category.name, updated.category || current);
    console.log("Category image", category.name);
  }

  const existingProducts = await api("/api/admin/products", { token });
  const productNames = new Set((existingProducts.products || []).map((product) => product.name));

  for (const product of products) {
    if (productNames.has(product.name)) {
      console.log("Skip", product.name);
      continue;
    }

    const category = categoryByName.get(product.category);
    const form = new FormData();
    form.append("category_id", String(category.id));
    form.append("name", product.name);
    form.append("brand", product.brand);
    form.append("short_description", product.short_description);
    form.append("description", product.description);
    form.append("mrp", String(product.mrp));
    form.append("selling_price", String(product.selling_price));
    form.append("material", product.material);
    form.append("wood_type", product.wood_type);
    form.append("length", String(product.length));
    form.append("width", String(product.width));
    form.append("height", String(product.height));
    form.append("weight", String(product.weight));
    if (product.seating_capacity !== "") form.append("seating_capacity", String(product.seating_capacity));
    form.append("assembly_required", product.assembly_required);
    form.append("delivery_days", String(product.delivery_days));
    form.append("main_image", await imageFile(product.image, `${product.name.replace(/\s+/g, "-").toLowerCase()}.jpg`));

    const created = await api("/api/admin/products", { method: "POST", token, form });
    const productId = created.product.id;
    console.log("Product", productId, product.name);

    for (const variant of product.variants) {
      await api("/api/admin/product-variants", {
        method: "POST",
        token,
        body: { product_id: productId, ...variant },
      });
      console.log("  Variant", variant.variant_name);
    }
  }

  const publicProducts = await api("/api/public/products");
  console.log("Public products:", (publicProducts.data || []).length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
