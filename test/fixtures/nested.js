
object.nest1.nest2.default.nest3 = "string";
object.nest1.public.nest2.nest4 = "string";
object['nest1'].protected['nest2'] = "string";
object['nest1']['nest2'].private['nest3'] = "string";

function get() {
	return _interopRequireDefault(_something).default;
}
