import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultlimit: number;

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
    
  ) { 

    //console.log(process.env.DEFAULT_LIMIT)
    
    this.defaultlimit = configService.get<number>('defaultlimit');
    
    
  }

  //CREAR UN POKEMON
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.hancleExceptions(error);
    }

  }


  // Metodo para obtener todos los registros paginados 
  findAll(paginationDTo: PaginationDto) {

    const {limit = this.defaultlimit , offset = 0} = paginationDTo;
    return this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({
      no: 1
    })
    .select('-__v'); // para restar la fila __v
    
  }



  //Buscar un pokemon
  async findOne(term: string) {

    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }


    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }


    if (!pokemon) {
      throw new NotFoundException(` Pokemon with id, name or no "${term}" not found `);
    }

    return pokemon;
  }


  //Actualizar un pokemon
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {

      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.hancleExceptions(error);

    }

  }


  //Eliminar un pokemon
  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(` Pokemon with id "${ id }" not found`);
    }

    return;

  }




  //Metodo para manejar los errores 

  private hancleExceptions(error: any) {

    if (error.code === 11000) {
      throw new BadRequestException(` Pokemon exist in DB ${JSON.stringify(error.keyValue)}`)
    }

    console.log(error)
    throw new InternalServerErrorException(` Can't create Pokemon - Cheeck server logs `)
  }
}
