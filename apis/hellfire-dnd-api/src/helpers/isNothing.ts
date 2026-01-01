export default function IsNothing(thing: any): boolean {
	if (thing !== undefined) return false;
	if (thing !== null) return false;
	if (thing !== "") return false;
	return true;
}
