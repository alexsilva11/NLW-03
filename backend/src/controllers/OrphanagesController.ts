import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import orphanages_view from '../views/orphanages_view';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage'

export default {
    async index (req: Request, res: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return res.json(orphanages_view.renderMany(orphanages))
    },
    async show (req: Request, res: Response) {
        const { id } = req.params

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return res.json(orphanages_view.render(orphanage))
    },

    async create(req: Request, res: Response) {


        const {
            name,
            longitude,
            latitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            whatsapp
        } = req.body;
    
        const orphanagesRepository = getRepository(Orphanage);

        const requestImages = req.files as Express.Multer.File[];

        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        const data = {
            name,
            longitude,
            latitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends : open_on_weekends === 'true',
            whatsapp,
            images
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            longitude: Yup.number().required(),
            latitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            whatsapp: Yup.number().required(),
            images: Yup.array(
                Yup.object().shape({
                path: Yup.string().required()
            }))
        });

        await schema.validate(data, {
            abortEarly: false, 
        })
    
        const orphanage = orphanagesRepository.create(data);
    
        await orphanagesRepository.save(orphanage)
    
        return res.status(201).json(orphanage)
    }
}