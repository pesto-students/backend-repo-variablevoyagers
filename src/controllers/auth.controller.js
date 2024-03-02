import { UserService } from '@/services';

export const createUser = async (req, res) => {
	try {
		const existingEmail = await UserService.findByEmail(req.body.email);
		if (existingEmail) {
			return res.status(409).json({
				message: 'Email already exists',
				status: 409,
				success: false,
			});
		}
		if (req.body.phone) {
			const existingPhone = await UserService.findByPhone(req.body.phone);
			if (existingPhone) {
				return res.status(409).json({
					message: 'Phone number already exists',
					status: 409,
					success: false,
				});
			}
		}

		const hashedPassword = await UserService.hashPassword(req.body.password);
		const newUser = await UserService.create({
			...req.body,
			password: hashedPassword,
		});
		delete newUser.password;
		return res.status(201).json({
			message: 'success',
			data: newUser,
			status: 201,
			success: true,
		});
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Finding the user by email and verifying the password
		const user = await UserService.findByCredentials(email, password);

		if (!user) {
			return res.status(401).json({
				message: 'Invalid email or password',
				status: 401,
				success: false,
			});
		}
		delete user.password;
		res.status(200).json({
			message: 'Login successful',
			status: 200,
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
};